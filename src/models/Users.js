const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    full_name: { type: String },
    phone_number: { type: String },
    username: { type: String },
    telegram_id: { type: Number },
    image: { type: String },
    passport: { type: String },
    passport_file: { type: String },
  },
  { timestamps: true }
)

module.exports = model('users', UserSchema)
