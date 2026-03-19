import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  apiKey: { type: String, required: true, index: true },
  widgetType: { type: String, required: true }, // viewers, purchases, exit-intent
  eventType: { type: String, required: true }, // view, click
  metadata: { type: mongoose.Schema.Types.Mixed }, // mode, url, etc.
  createdAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
