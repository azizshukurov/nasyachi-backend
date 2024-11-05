const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
  {
    client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    guarantor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Guarantor',
      required: true,
    },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    installmentMonth: { type: Number, required: true },
    startDate: { type: Date, required: true },
    finishDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    initialPaymentSumm: { type: Number, required: true },
    monthlyPaymentSumm: { type: String, required: true },
    profit: { type: Number, required: true },
    profitPercentage: { type: Number, required: true },
    file: { type: String },
    status: { type: String, enum: [0, 1, 2], default: 1 },
  },
  { timestamps: true }
)

module.exports = model('Order', OrderSchema)
