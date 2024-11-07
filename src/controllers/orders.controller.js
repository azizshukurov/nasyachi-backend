const Order = require('../models/Order')
const OrderPayment = require('../models/OrderPayment')
const dateFormat = require('../utils/date-format')
const createPDF = require('../utils/payments-check')

function formatNumber(num) {
  return num.toLocaleString('de-DE')
}

const getAll = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('product_id')
      .populate('guarantor_id')
      .populate('client_id')

    return res.status(200).json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
}

const getOne = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product_id')
      .populate('guarantor_id')
      .populate('client_id')

    if (!order) {
      return res
        .status(200)
        .json({ success: false, message: 'Buyurtma topilmadi!' })
    }

    return res.status(200).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const installmentMonth = Number(req.body.installmentMonth)
    const purchasePrice = Number(req.body.purchasePrice)
    const sellingPrice = Number(req.body.sellingPrice)
    const initialPaymentSumm = Number(req.body.initialPaymentSumm)

    const totalAmount = sellingPrice - initialPaymentSumm
    const monthlyPaymentSumm = totalAmount / installmentMonth
    const profit = sellingPrice - purchasePrice
    const profitPercentage = (profit / purchasePrice) * 100

    const order = await Order.create({
      ...req.body,
      monthlyPaymentSumm: Math.ceil(monthlyPaymentSumm),
      profit: profit,
      profitPercentage: profitPercentage.toFixed(2),
    })

    await OrderPayment.create({
      order_id: order._id,
      payment_month: 0,
      payment_amount: 0,
      residue_amount: order.sellingPrice,
      residue_month: order.installmentMonth,
    })

    return res.status(200).json({
      success: true,
      message: 'Successfully selling product!',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

const payMonthlyOrder = async (req, res, next) => {
  try {
    const { order_id, payment_amount } = req.body

    const orderItem = await OrderPayment.findOne({ order_id }).populate(
      'order_id'
    )

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi!',
      })
    }

    if (orderItem.order_id.status === 0) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma bekor qilingan!',
      })
    }

    if (orderItem.order_id.status == 2 && orderItem.residue_amount === 0) {
      return res.status(200).json({
        success: true,
        message:
          "Buyurtma muvaffaqiyatli tugatilgan (sotilgan), qilinishi kerak bo'lgan to'lovlar qolmagan!",
      })
    }

    const newResidueAmount = orderItem.residue_amount - payment_amount

    if (newResidueAmount < 0) {
      return res.status(400).json({
        success: false,
        message: `To'lov miqdori ortiqcha! Maksimal qarz: ${orderItem.residue_amount}`,
      })
    }

    await OrderPayment.updateOne(
      { order_id },
      {
        $inc: { residue_amount: -payment_amount },
        $set: {
          residue_month:
            orderItem.residue_amount - payment_amount <= 0
              ? 0
              : orderItem.residue_month - 1,
        },
      }
    )

    if (newResidueAmount === 0) {
      await Order.updateOne({ _id: order_id }, { status: 2 })
    }

    const orderDetails = await OrderPayment.findOne({ order_id }).populate({
      path: 'order_id',
      populate: [{ path: 'client_id' }, { path: 'product_id' }],
    })

    const data = {
      client_name: orderDetails.order_id.client_id.full_name,
      product_name: orderDetails.order_id.product_id.name,
      date: dateFormat(),
      payment_amount,
      residue_month: orderDetails.residue_month,
      residue_amount: orderDetails.residue_amount,
    }

    const path = createPDF(data)

    return res.status(200).json({
      success: true,
      message: "Buyurtma to'lovlar amalga oshirildi!",
      data: { file: path },
    })
  } catch (error) {
    next(error)
  }
}

const payAllAmountOrder = async (req, res, next) => {
  try {
    const { order_id, payment_amount, discount_amount } = req.body
    const total_payment_summ = payment_amount + discount_amount

    const orderItem = await OrderPayment.findOne({ order_id }).populate(
      'order_id'
    )

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi!',
      })
    }

    if (orderItem.order_id.status === 0) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma bekor qilingan!',
      })
    }

    if (orderItem.order_id.status == 2 && orderItem.residue_amount == 0) {
      return res.status(200).json({
        success: true,
        message:
          "Buyurtma muvaffaqiyatli tugatilgan (sotilgan), qilinishi kerak bo'lgan to'lovlar qolmagan!",
      })
    }

    if (orderItem.residue_amount !== total_payment_summ) {
      return res.status(404).json({
        success: false,
        message: `Mablag' noto'g'ri kiritilgan! Qolgan qarz ${orderItem.residue_amount}`,
      })
    }

    await Order.updateOne({ _id: order_id }, { status: 2 })
    await OrderPayment.updateOne(
      { order_id },
      {
        residue_month: 0,
        residue_amount: 0,
        discount_amount: discount_amount || 0,
      }
    )

    const orderDetails = await OrderPayment.findOne({ order_id }).populate({
      path: 'order_id',
      populate: [{ path: 'client_id' }, { path: 'product_id' }],
    })

    const data = {
      client_name: orderDetails.order_id.client_id.full_name,
      product_name: orderDetails.order_id.product_id.name,
      date: dateFormat(),
      payment_amount,
      residue_month: orderDetails.residue_month,
      residue_amount: orderDetails.residue_amount,
    }

    const path = createPDF(data)

    return res.status(200).json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli yakunlandi, qarzdorlik qolmadi!',
      data: { file: path },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getOne,
  getOne,
  create,
  payMonthlyOrder,
  payAllAmountOrder,
}
