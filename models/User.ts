import mongoose from 'mongoose';

const widgetSettingsSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  position: { type: String, default: 'bottom-right' },
  style: { type: String, default: 'dark' },
  template: { type: String, default: '' },
  delay: { type: Number, default: 3000 },
  hideAfter: { type: Number, default: 10000 },
  mode: { type: String, default: 'floating' },
  // Discount System
  discountEnabled: { type: Boolean, default: false },
  discountMode: { type: String, enum: ['code', 'redirect', 'api'], default: 'code' },
  discountCode: { type: String, default: '' },
  redirectUrl: { type: String, default: '' },
  apiUrl: { type: String, default: '' },
  apiMethod: { type: String, enum: ['GET', 'POST'], default: 'POST' },
  apiHeaders: { type: String, default: '{}' },
  apiBody: { type: String, default: '{}' },
  autoCopy: { type: Boolean, default: false },
  autoRedirect: { type: Boolean, default: false },
  redirectDelay: { type: Number, default: 5 },
  successMessage: { type: String, default: 'Success!' },
  targetUrls: { type: [String], default: [] },
  inventory: { type: [String], default: [] },
  targetSelector: { type: String, default: '' },
  templateLong: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: { type: String, unique: true },
  plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
  usageCount: { type: Number, default: 0 },
  widgets: {
    viewers: { type: widgetSettingsSchema, default: () => ({ enabled: true, template: '🔥 {count} people are viewing' }) },
    purchases: { type: widgetSettingsSchema, default: () => ({ enabled: false, template: '🛒 Someone just purchased {product} from {location}' }) },
    exitIntent: { type: widgetSettingsSchema, default: () => ({ enabled: false, template: 'Don\'t leave! Here is a gift: {code}', discountEnabled: true }) },
    retention: { type: widgetSettingsSchema, default: () => ({ enabled: false, template: 'Thanks for staying! Use this code to checkout: {code}', discountEnabled: true }) },
    scarcity: { type: widgetSettingsSchema, default: () => ({ enabled: false, template: '🔥 Only {count} items left in stock!' }) },
    loyalty: { type: widgetSettingsSchema, default: () => ({ enabled: false, template: 'Chương trình Loyalty' }) },
    welcome: { type: widgetSettingsSchema, default: () => ({ enabled: false, template: 'Chào mừng bạn quay lại! Rất vui được gặp lại bạn.', delay: 2000, hideAfter: 8000 }) }
  },
  seoEnabled: { type: Boolean, default: false },
  seoKeywords: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
  if (!this.apiKey) {
    this.apiKey = 'tlp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  next();
});

// In development, handle hot-reloads by checking if the model is already defined
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.User;
}

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;
