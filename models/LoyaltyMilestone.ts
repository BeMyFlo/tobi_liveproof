import mongoose from 'mongoose';

const LoyaltyMilestoneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  threshold: {
    type: Number, // Number of orders required
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.LoyaltyMilestone || mongoose.model('LoyaltyMilestone', LoyaltyMilestoneSchema);
