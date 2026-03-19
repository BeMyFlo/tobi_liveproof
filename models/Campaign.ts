import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  url: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  discountCode: { type: String },
  isSoldOut: { type: Boolean, default: false }
});

const CampaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'flash_sale' },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
  
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  isGlobal: { type: Boolean, default: true }, // Show on every page or specific pages
  targetUrls: [{ type: String }], // If not global, specify target product pages
  
  globalDiscountCode: { type: String },
  useGlobalDiscount: { type: Boolean, default: false },
  
  themeColor: { type: String, default: '#ef4444' }, // Flash sale red
  
  products: [ProductSchema],
  
  viewCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
