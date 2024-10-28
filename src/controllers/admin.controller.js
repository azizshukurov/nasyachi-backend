const Admins = require('../models/Admins')
const Users = require('../models/Users')

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find()

    return res
      .status(200)
      .json({ success: true, message: 'Success', data: users })
  } catch (error) {
    console.log(error)
  }
}

const getOneUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const users = await Users.findOne({ _id: id })

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found by this id!' })
    }

    return res
      .status(200)
      .json({ success: true, message: 'Success', data: users })
  } catch (error) {
    console.log(error)
  }
}

const create = async (req, res, next) => {
  try {
    const user = await Users.findOne({ phone_number: req.body.phone_number })

    if (user) {
      return res.status(404).json({
        success: false,
        message: 'User already exist by this phone_number!',
      })
    }

    const newUser = await Users.create({ ...req.body })

    return res.status(404).json({
      success: true,
      message: 'Successfully user created!',
      data: newUser,
    })
  } catch (error) {
    console.log(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await Users.findOne({ _id: id })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    await Users.findOneAndUpdate({ _id: id }, { ...req.body })
    const updatedUser = await Users.findOne({ _id: id })

    return res.status(200).json({ success: true, data: updatedUser })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const users = await Users.findOne({ _id: id })

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found by this id!' })
    }

    await Users.deleteOne({ _id: id })

    return res
      .status(200)
      .json({ success: true, message: 'Successfully user deleted!' })
  } catch (error) {
    console.log(error)
  }
}

const addAdmin = async (req, res, next) => {
  try {
    const { phone_number } = req.query
    const admin = await Admins.findOne({ phone_number })

    if (!admin) {
      const newAdmin = await Admins.create({ phone_number })

      return res.status(404).json({
        success: false,
        message: 'Admin successfully created!',
        data: newAdmin,
      })
    }

    return res
      .status(200)
      .json({ success: true, message: 'Admin already exists!', data: admin })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllUsers,
  getOneUser,
  deleteUser,
  updateUser,
  addAdmin,
  create,
}
