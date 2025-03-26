import { Schema, model } from 'mongoose';

const FeedbackSchema = new Schema({
  queryId: { type: Schema.ObjectId, ref: 'Query', required: true },
  studentId: { type: Schema.ObjectId, ref: 'User', required: true },
  rating: { type: String, required:true, enum: ['satisfied', 'notsatisfied'], default: '' },
  comment: { type: String },
  resolvedAt: { type: Date, default: Date.now }  // New field for tracking resolution
}, { timestamps: true });


// Prevent user from submitting more than one feedback per query
FeedbackSchema.index({ queryId: 1, studentId: 1 }, { unique: true });

export default model('Feedback', FeedbackSchema);