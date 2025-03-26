// models/Response.js
import { Schema, model } from 'mongoose';

const ResponseSchema = new Schema({
  queryId: {
    type: Schema.ObjectId,
    ref: 'Query',
    required: true
  },
  responderId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add response content']
  }
}, {
  timestamps: true
});

export default model('Response', ResponseSchema);