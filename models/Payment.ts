import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  plan: { type: String, enum: ['pro', 'premium'], required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED'], default: 'PENDING' },
  orderCode: { type: String, unique: true, required: true }, // SePay order ID or code
  memo: { type: String, unique: true, required: true }, // Unique string for customer to put in bank transfer message
  paymentLinkId: { type: String }, // SePay transaction ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
paymentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Payment;
}

const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default PaymentModel;
