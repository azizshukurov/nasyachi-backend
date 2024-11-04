const Guarantor = require('../models/Guarantor')

const getAll = async (req, res, next) => {
  try {
    const guarantor = await Guarantor.find()

    return res.status(200).json(guarantor)
  } catch (error) {
    next(error)
  }
}

const getOne = async (req, res, next) => {
  try {
    const guarantor = await Guarantor.findById(req.params.id)

    if (!guarantor) {
      return res
        .status(200)
        .json({ success: false, message: 'Kafil topilmadi!' })
    }

    return res.status(200).json(guarantor)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const guarantor = await Guarantor.create({ ...req.body })

    return res.status(200).json(guarantor)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const guarantor = await Guarantor.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body }
    )

    if (!guarantor) {
      return res
        .status(200)
        .json({ success: false, message: 'Kafil topilmadi!' })
    }

    return res.status(200).json({
      success: true,
      message: "Kafil mufavvaqiyatli o'zgartirildi!",
      data: { id: guarantor._id },
    })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const guarantor = await Guarantor.findOneAndDelete({ _id: req.params.id })

    if (!guarantor) {
      return res.status(200).json({
        success: false,
        message: "Kafil topilmadi yoki o'chirishda xatolik yuz berdi!",
      })
    }

    return res
      .status(200)
      .json({ success: true, message: "Kafil mufavvaqiyatli o'chirildi!" })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, update, remove }
