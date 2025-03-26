import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import { validateUserRegistration } from '../utils/validations.js';

// ✅ Register User
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return next(new ErrorResponse("All fields are required", 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("Email already registered", 400));
  }

  // ✅ Ensure departmentName is set
  const departmentName = role === 'department' ? name.toLowerCase() : null;

  // ✅ Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    departmentName, // Explicitly setting departmentName
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

// ✅ Login User
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login Request Received:", email);

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  console.log("Login Successful for:", user.email);
  sendTokenResponse(user, 200, res);
});

// ✅ Get Profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password'); // No need to populate department

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ✅ Update Profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ✅ Generate Token and Send Response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  console.log("Generated Token:", token);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentName: user.departmentName || "N/A",
    },
  });
};


export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      departmentName: user.departmentName, // Return department name
    },
  });
});
