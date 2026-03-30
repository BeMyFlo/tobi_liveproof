import mongoose from 'mongoose';

// Stores co-occurrence: "people who viewed fromUrl also viewed toUrl"
// Updated incrementally, queried instantly — no dynamic scanning needed.
const productRelationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromUrl:   { type: String, required: true },
  toUrl:     { type: String, required: true },
  toTitle:   { type: String, default: '' },
  toImage:   { type: String, default: '' },
  count:     { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now },
});

// Unique constraint: one record per (user, fromUrl, toUrl) pair
productRelationSchema.index({ userId: 1, fromUrl: 1, toUrl: 1 }, { unique: true });
// Fast lookup for recommendations
productRelationSchema.index({ userId: 1, fromUrl: 1, count: -1 });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.ProductRelation;
}

const ProductRelation = mongoose.models.ProductRelation || mongoose.model('ProductRelation', productRelationSchema);
export default ProductRelation;
