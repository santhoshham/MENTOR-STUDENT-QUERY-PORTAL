import Query from '../models/Query.js';
import Response from '../models/Response.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// ✅ Helper function to check department ownership
const checkDepartmentAuthorization = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const query = await Query.findById(req.params.id).populate("departmentId");

    if (!query) {
      return res.status(404).json({ success: false, error: "Query not found" });
    }

    if (!user || user.departmentId.toString().toLowerCase() !== query.departmentId._id.toString().toLowerCase()) {
      return res.status(403).json({ success: false, error: "Not authorized to access this query" });
    }

    next(); // Proceed to the next middleware if authorized
  } catch (error) {
    console.error("Error in checkDepartmentAuthorization:", error);
    
    if (res && typeof res.status === "function") {
      return res.status(500).json({ success: false, error: "Server error" });
    } else {
      console.error("Response object is not valid:", res);
    }
  }
};



// Get all queries assigned to a department with proper response handling
export const getDepartmentQueries = asyncHandler(async (req, res, next) => {
  try {
    const departmentName = req.user.departmentName; // Fetch department name from user

    if (!departmentName) {
      return next(new ErrorResponse('Department name is required', 400));
    }

    // Fetch queries for the department
    const queries = await Query.find({ 
      departmentName: { $regex: new RegExp(`^${departmentName}$`, 'i') } 
    })
      .populate('studentId', 'name email')
      .sort('-createdAt')
      .lean(); // Use lean() for better performance
    
    // Get all query IDs
    const queryIds = queries.map(query => query._id);
    
    // Fetch responses separately
    const responses = await Response.find({ 
      queryId: { $in: queryIds } 
    }).populate('responderId', 'name role').lean();
    
    // Attach responses to their queries
    const queriesWithResponses = queries.map(query => {
      const queryResponses = responses.filter(
        response => response.queryId.toString() === query._id.toString()
      );
      
      return {
        ...query,
        responses: queryResponses.length > 0 ? queryResponses : "N/A",
        // If the query is resolved but doesn't have a resolvedAt timestamp, use updatedAt
        resolvedAt: query.status === "solved" && !query.resolvedAt ? query.updatedAt : query.resolvedAt
      };
    });

    res.status(200).json({
      success: true,
      count: queriesWithResponses.length,
      data: queriesWithResponses
    });
  } catch (error) {
    console.error("Error fetching department queries:", error);
    next(new ErrorResponse(error.message, 500));
  }
});

// ✅ Update query status (e.g., pending -> in-progress -> solved)
export const updateQueryStatus = asyncHandler(async (req, res, next) => {
  let query = await Query.findById(req.params.id);
  if (!query) return next(new ErrorResponse(`No query with id ${req.params.id}`, 404));

  checkDepartmentAuthorization(query, req.user);

  const updateData = { status: req.body.status };
  if (req.body.status === 'solved' && query.status !== 'solved') {
    updateData.resolvedAt = Date.now();
  }

  query = await Query.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

  res.status(200).json({ success: true, data: query });
});

// ✅ Respond to a query
export const respondToQuery = asyncHandler(async (req, res, next) => {
  const query = await Query.findById(req.params.id);
  if (!query) return next(new ErrorResponse(`No query with id ${req.params.id}`, 404));

  checkDepartmentAuthorization(query, req.user);

  if (!req.body.response || req.body.response.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Response content is required" });
}


  const response = await Response.create({
    queryId: req.params.id,
    responderId: req.user.id,
    content: req.body.response
  });

  await Query.findByIdAndUpdate(req.params.id, {
    $set: { status: query.status === 'pending' ? 'in-progress' : query.status }
  });

  res.status(201).json({ success: true, data: response });
});

// ✅ Get a single query with its responses
export const getQueryWithResponses = asyncHandler(async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate("studentId", "name")
      .populate({
        path: "responses",
        populate: { path: "responderId", select: "name role" },
      });

    if (!query) {
      return next(new ErrorResponse(`No query found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: query });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
});


// Get all pending queries assigned to a department
// Get all queries with stats for a department dashboard
// Get pending queries with comprehensive stats for dashboard
export const getPendingDepartmentQueries = asyncHandler(async (req, res, next) => {
  try {
    const departmentName = req.user.departmentName;

    if (!departmentName) {
      return next(new ErrorResponse('Department name is required', 400));
    }

    // First, get ALL queries to calculate overall stats
    const allDepartmentQueries = await Query.find({ 
      departmentName: { $regex: new RegExp(`^${departmentName}$`, 'i') }
    });

    // Calculate stats from all queries
    const stats = {
      total: allDepartmentQueries.length,
      solved: allDepartmentQueries.filter(q => q.status === 'solved').length,
      pending: allDepartmentQueries.filter(q => q.status === 'pending').length,
      inProgress: allDepartmentQueries.filter(q => q.status === 'in-progress').length
    };

    // Now get pending queries for display (you can change this to all queries if needed)
    const pendingQueries = allDepartmentQueries.filter(q => q.status === 'pending');

    // If you want ALL queries instead of only pending, use this line instead:
    // const pendingQueries = allDepartmentQueries;

    res.status(200).json({
      success: true,
      stats: stats,
      data: pendingQueries
    });
  } catch (error) {
    console.error("Error fetching department queries and stats:", error);
    next(new ErrorResponse(error.message, 500));
  }
});