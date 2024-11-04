const { Schema, model } = require('mongoose')

const GuarantorSchema = new Schema(
  {
    full_name: { type: String, required: true },
    passport: { type: String, required: true },
    phone_number: { type: String, required: true },
    passport_file: { type: String },
  },
  { timestamps: true }
)

module.exports = model('Guarantor', GuarantorSchema)
