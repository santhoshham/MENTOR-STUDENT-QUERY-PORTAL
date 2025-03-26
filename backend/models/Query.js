import { Schema, model } from 'mongoose';

const QuerySchema = new Schema({
  title: { type: String, required: [true, 'Please add a title'], trim: true },
  description: { type: String, required: [true, 'Please add a description'] },
  studentId: { type: Schema.ObjectId, ref: 'User', required: true },
  departmentName: { type: String, required: true, trim: true },  // Store department name instead of ID
  status: { type: String, enum: ['pending', 'new', 'solved', 'unsolved'], default: 'new' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  resolvedAt: { type: Date, default: null },
  responses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Response'
    }
  ]
}, { timestamps: true });

// Middleware to delete associated responses and feedback when query is deleted
QuerySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const queryId = this._id;
  await model('Response').deleteMany({ queryId });
  await model('Feedback').deleteMany({ queryId });
  next();
});

export default model('Query', QuerySchema);
