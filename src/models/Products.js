const { Schema, model } = require('mongoose')

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number },
    date: { type: Date },
    file: { type: String },
    seller: { type: String },
    passport: { type: String },
    phone_number: { type: String },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Product', ProductSchema)
