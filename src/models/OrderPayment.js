const { Schema, model } = require('mongoose')

const OrderPaymentSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_month: { type: String },
    payment_amount: { type: Number },
    discount_amount: { type: Number, default: 0 },
    residue_month: { type: String },
    residue_amount: { type: Number },
  },
  { timestamps: true }
)

module.exports = model('OrderPayment', OrderPaymentSchema)
