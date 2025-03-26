import Query from '../models/Query.js';
import Department from '../models/Department.js';
import Response from '../models/Response.js';
import Feedback from '../models/Feedback.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { validateQuery, validateFeedback } from '../utils/validations.js';
import mongoose from 'mongoose';

export const getResponses = async (req, res) => {
  try {
    const responses = await Response.find();
    
    res.json({ data: responses });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching responses' });
  }
};

// ✅ Create a new query
export const createQuery = asyncHandler(async (req, res, next) => {
  console.log("Received Data:", req.body);

  // Validate request body
  const { error } = validateQuery(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  // Add user to request body
  req.body.studentId = req.user.id;

  const query = await Query.create(req.body);

  res.status(201).json({
    success: true,
    data: query
  });
});

// ✅ Get all queries for the logged-in student
export const getQueries = async (req, res) => {
  try {
    const queries = await Query.find({ status: { $in: ["unsolved", "new", "pending"] } }); // ✅ Filtered queries
    res.json({ success: true, data: queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllQueries = asyncHandler(async (req, res) => {
  try {
    const studentId = req.user.id; // Get logged-in student's ID

    // ✅ Fetch queries related to the logged-in student
    const queries = await Query.find({ studentId }).sort({ createdAt: -1 }).lean(); // Use lean() for performance

    // ✅ Extract query IDs
    const queryIds = queries.map(query => query._id);

    // ✅ Fetch responses separately
    const responses = await Response.find({ queryId: { $in: queryIds } })
      .populate({ path: "responderId", select: "name role" })
      .lean();

    // ✅ Attach responses to their respective queries
    const queriesWithResponses = queries.map(query => ({
      ...query,
      responses: responses.filter(res => res.queryId.toString() === query._id.toString()),
      resolvedAt: query.status === "solved" && !query.resolvedAt ? query.updatedAt : query.resolvedAt, // Ensure resolvedAt is set
    }));

    res.status(200).json({ success: true, data: queriesWithResponses });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// ✅ Get a single query by ID
export const getQuery = asyncHandler(async (req, res, next) => {
  console.log("Fetching query details for ID:", req.params.id);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("Invalid ObjectId format:", req.params.id);
    return next(new ErrorResponse('Invalid query ID format', 400));
  }

  const query = await Query.findById(req.params.id)
    .populate('studentId', 'name')
    .populate({
      path: 'responses',
      populate: { path: 'responderId', select: 'name role' }
    });

  if (!query) {
    console.warn(`Query not found with ID: ${req.params.id}`);
    return next(new ErrorResponse(`No query with ID ${req.params.id}`, 404));
  }

  const feedback = await Feedback.findOne({
    queryId: req.params.id,
    studentId: req.user.id
  });

  console.log(`Query found: ${query}`);
  console.log(`Feedback found: ${feedback}`);

  res.status(200).json({
    success: true,
    data: {
      query,
      resolvedBy: query.responses?.[query.responses.length - 1]?.responderId?.name || 'N/A',
      resolvedDate: query.resolvedAt,
      responses: query.responses,
      feedback: feedback || null
    }
  });
});

// ✅ Submit feedback for a query
// ✅ Submit feedback for a query
export const submitFeedback = asyncHandler(async (req, res, next) => {
  console.log("Submitting feedback for Query ID:", req.params.id);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("Invalid ObjectId format:", req.params.id);
    return next(new ErrorResponse('Invalid query ID format', 400));
  }

  // Validate feedback data
  const { error } = validateFeedback(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  const query = await Query.findById(req.params.id);

  if (!query) {
    console.warn(`No query found with ID: ${req.params.id}`);
    return next(new ErrorResponse(`No query with id ${req.params.id}`, 404));
  }

  if (query.studentId.toString() !== req.user.id) {
    console.error("User not authorized for this query.");
    return next(new ErrorResponse(`Not authorized to provide feedback for this query`, 401));
  }

  if (query.status !== 'solved') {
    console.warn(`Attempt to submit feedback for unsolved query ID: ${req.params.id}`);
    return next(new ErrorResponse(`Feedback can only be provided for solved queries`, 400));
  }

  const existingFeedback = await Feedback.findOne({
    queryId: req.params.id,
    studentId: req.user.id
  });

  let feedback;
  if (existingFeedback) {
    feedback = await Feedback.findByIdAndUpdate(
      existingFeedback._id,
      req.body,
      { new: true, runValidators: true }
    );
    console.log("Updated Feedback:", feedback);
  } else {
    feedback = await Feedback.create({
      queryId: req.params.id,
      studentId: req.user.id,
      rating: req.body.rating,  // 'satisfied' or 'not satisfied'
      comment: req.body.comment
    });
    console.log("New Feedback Created:", feedback);
  }

  // Check if feedback is "satisfied" or "not satisfied"
  const newStatus = req.body.rating === 'satisfied' ? 'solved' : 'unsolved';

  await Query.findByIdAndUpdate(req.params.id, { status: newStatus });

  console.log(`Query ID ${req.params.id} status updated to: ${newStatus}`);

  res.status(200).json({
    success: true,
    data: feedback,
    queryStatus: newStatus
  });
});


export const getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Department.find().select('name description contactEmail contactPhone');

  res.status(200).json({
    success: true,
    count: departments.length,
    data: departments
  });
});
