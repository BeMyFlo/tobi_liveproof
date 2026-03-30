import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true }, // The unique ID stored in the user's browser (LocalStorage)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The owner of the website
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
  viewHistory: [{
    url: String,
    title: String,
    image: String,
    timestamp: { type: Date, default: Date.now }
  }],
  metadata: {
    ip: String,
    userAgent: String,
    location: {
      country: String,
      city: String
    }
  }
});

// Index for fast lookup by visitorId and site owner
visitorSchema.index({ visitorId: 1, userId: 1 }, { unique: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Visitor;
}

const VisitorModel = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
export default VisitorModel;
