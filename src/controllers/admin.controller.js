const Admins = require('../models/Admins')

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
  addAdmin,
}
