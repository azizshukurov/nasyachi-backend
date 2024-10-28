const { Schema, model } = require('mongoose')

const AdminSchema = new Schema(
  {
    full_name: { type: String },
    phone_number: { type: String },
    username: { type: String },
    telegram_id: { type: Number },
  },
  { timestamps: true }
)

module.exports = model('admins', AdminSchema)
