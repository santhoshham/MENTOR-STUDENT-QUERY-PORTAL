import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/config.js';

// Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log("❌ No token provided!");
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    console.log("🔍 Verifying Token:", token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    req.user = await User.findById(decoded.id);
    console.log("Fetched User from DB:", req.user);

    if (!req.user) {
      console.log("❌ User not found for decoded token ID:", decoded.id);
      return next(new ErrorResponse('User no longer exists', 401));
    }

    next();
  } catch (err) {
    console.log("❌ JWT Verification Error:", err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});


export const admin = (req, res, next) => {
  console.log("🔐 User Role:", req.user.role);
  
  if (req.user && req.user.role === 'admin') {
      next();
  } else {
      console.log("❌ Unauthorized: User is not an admin.");
      res.status(403).json({ message: 'Admin access only' });
  }
};

