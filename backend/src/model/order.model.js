import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'eSewa']
  },
  paymentResult: {
    transactionCode: String,
    status: String,
    updateTime: String
  },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);