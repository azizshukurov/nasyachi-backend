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
    const {
      order_id,
      payment_month,
      payment_amount,
      payment_type,
      months_to_pay,
    } = req.body

    const order = await Order.findById(order_id)
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found!' })
    }

    const paymentList = await OrderPayment.find({ order_id })

    const existingPayment = paymentList.find(
      (payment) => payment.payment_month === payment_month
    )
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment for this month already exists!',
      })
    }

    const remainingMonths = order.installmentMonth - paymentList.length
    if (remainingMonths <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No remaining installments left to pay!',
      })
    }

    let paymentAmount
    let residueAmount
    let residueMonths

    if (payment_type === 'monthly') {
      // Monthly payment
      paymentAmount = order.monthlyPaymentSumm
      residueMonths = remainingMonths - 1
      residueAmount = residueMonths * order.monthlyPaymentSumm
    } else if (payment_type === 'multiple') {
      // Pay for multiple months at once
      const monthsToPay = months_to_pay || 1 // Default to 1 if not provided
      if (monthsToPay > remainingMonths) {
        return res.status(400).json({
          success: false,
          message: `Cannot pay for more than ${remainingMonths} remaining months.`,
        })
      }
      paymentAmount = order.monthlyPaymentSumm * monthsToPay
      residueMonths = remainingMonths - monthsToPay
      residueAmount = residueMonths * order.monthlyPaymentSumm
    } else if (payment_type === 'full') {
      // Pay off the full remaining balance
      paymentAmount = remainingMonths * order.monthlyPaymentSumm
      residueMonths = 0
      residueAmount = 0
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment type specified!',
      })
    }

    // Create a new payment record
    const newPayment = await OrderPayment.create({
      order_id,
      payment_month,
      payment_amount: paymentAmount,
      residue_month: residueMonths,
      residue_amount: residueAmount,
    })

    return res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: { order, payment: newPayment },
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
