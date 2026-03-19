import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
    index: true,
  },
  productName: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    default: 'Someone',
  },
  customerLocation: {
    type: String,
    default: 'Earth',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
