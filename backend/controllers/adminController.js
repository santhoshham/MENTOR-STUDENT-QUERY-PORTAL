import User from '../models/User.js';
import Department from '../models/Department.js';
import Query from '../models/Query.js';
import Feedback from '../models/Feedback.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { validateUserRegistration, validateDepartment } from '../utils/validations.js';

// Add a new department
export const addDepartment = asyncHandler(async (req, res, next) => {
  const { error } = validateDepartment(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
});

// Get all departments
export const getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Department.find();
  res.status(200).json({ success: true, count: departments.length, data: departments });
});

// Update a department
export const updateDepartment = asyncHandler(async (req, res, next) => {
  const { error } = validateDepartment(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!department) return next(new ErrorResponse(`No department with id ${req.params.id}`, 404));

  res.status(200).json({ success: true, data: department });
});

// Add a new user
export const addUser = asyncHandler(async (req, res, next) => {
  const { error } = validateUserRegistration(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message, 400));

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return next(new ErrorResponse('Email already registered', 400));

  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

// Update a user
export const updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`No user with id ${req.params.id}`, 404));

  if (req.body.password) delete req.body.password;

  user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});

// Get all queries with pagination and filters
/*export const getQueries = asyncHandler(async (req, res, next) => {
  try {
      let query = Query.find();

      if (req.query.select) query = query.select(req.query.select.split(',').join(' '));
      query = req.query.sort ? query.sort(req.query.sort.split(',').join(' ')) : query.sort('-createdAt');

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const total = await Query.countDocuments();

      query = query.skip(startIndex).limit(limit);

      const queries = await query.populate('studentId', 'name').exec();

      res.status(200).json({
          success: true,
          count: queries.length,
          pagination: {
              next: endIndex < total ? { page: page + 1, limit } : null,
              prev: startIndex > 0 ? { page: page - 1, limit } : null
          },
          data: queries
      });
  } catch (error) {
      console.error("Error fetching queries:", error);  // Logs actual error
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});*/

export const getQueries = asyncHandler(async (req, res, next) => {
  try {
    const queries = await Query.find()
      .populate('studentId', 'name') 
      .populate('responses.responderId', 'name') 
      .sort({ createdAt: -1 });

    if (!queries.length) {
      return res.status(200).json({ success: true, count: 0, message: "No queries found.", data: [] });
    }

    res.status(200).json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});


// Update a query
export const updateQuery = asyncHandler(async (req, res, next) => {
  let query = await Query.findById(req.params.id);
  if (!query) return next(new ErrorResponse(`No query with id ${req.params.id}`, 404));
  const { department, priority, status } = req.body; // Extract values from request body

  query.departmentName = department;
  query.priority = priority;
  query.status = status; // Change status to pending
  if (req.body.status === 'solved' && query.status !== 'solved') {
    req.body.resolvedAt = Date.now();
  }

  query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  res.status(200).json({ success: true, data: query });
});
//Get only new queries
export const getNewQueries = asyncHandler(async (req, res, next) => {
  const newQueries = await Query.find({ status: 'new' }).populate('studentId', 'name').exec();
  res.status(200).json({ success: true, count: newQueries.length, data: newQueries });
  
});
// Get only pending queries
export const getPendingQueries = asyncHandler(async (req, res, next) => {
  const pendingQueries = await Query.find({ status: 'pending' })    .populate('studentId', 'name').exec(); // Populate student name from User model
  
  res.status(200).json({ success: true, count: pendingQueries.length, data: pendingQueries });
});

// Get system stats
export const getStats = asyncHandler(async (req, res, next) => {
  const totalQueries = await Query.countDocuments();
  const solvedQueries = await Query.countDocuments({ status: 'solved' });
  const pendingQueries = await Query.countDocuments({ status: 'pending' });
  const inProgressQueries = await Query.countDocuments({ status: 'in-progress' });

  const totalDepartments = await Department.countDocuments();
  const totalStudents = await User.countDocuments({ role: 'student' });

  res.status(200).json({
    success: true,
    data: {
      queries: { total: totalQueries, solved: solvedQueries, pending: pendingQueries, inProgress: inProgressQueries },
      totalDepartments,
      totalStudents
    }
  });
});


// Get all feedbacks
export const getFeedbacks = asyncHandler(async (req, res, next) => {
  const feedbacks = await Feedback.find().populate('studentId', 'name');
  res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
});

// Get unsolved queries
export const getUnsolvedQueries = asyncHandler(async (req, res, next) => {
  const unsolvedQueries = await Query.find({ status: { $ne: 'solved' } }) .populate('studentId', 'name').exec();
  res.status(200).json({ success: true, count: unsolvedQueries.length, data: unsolvedQueries });
});

// Respond to a query
export const respondToQuery = asyncHandler(async (req, res, next) => {
  const { response } = req.body;
  const query = await Query.findById(req.params.id);

  if (!query) {
    return next(new ErrorResponse(`No query found with ID ${req.params.id}`, 404));
  }

  query.response = response;
  await query.save();

  res.status(200).json({ success: true, message: 'Response sent successfully.' });
});

// Mark query as solved
export const markQueryAsSolved = asyncHandler(async (req, res, next) => {
  let query = await Query.findById(req.params.id);

  if (!query) {
    return next(new ErrorResponse(`No query found with ID ${req.params.id}`, 404));
  }

  query.status = 'solved';
  query.resolvedAt = new Date();
  await query.save();

  res.status(200).json({ success: true, message: 'Query marked as solved.' });
});
