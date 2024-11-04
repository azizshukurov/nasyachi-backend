const { Schema, model } = require('mongoose')

const ClientSchema = new Schema(
  {
    full_name: { type: String },
    phone_number: { type: String },
    passport: { type: String },
    passport_file: { type: String },
    image: { type: String },
    username: { type: String },
    telegram_id: { type: Number },
  },
  { timestamps: true }
)

module.exports = model('Client', ClientSchema)
