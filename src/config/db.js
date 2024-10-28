const mongoose = require('mongoose')
const { DATABASE_URI } = require('./environments')

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI)
    console.log('Successfully connect DB')
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB