import ErrorResponse from "../utils/errorResponse.js";

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized, user not found', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      ));
    }
    next();
  };
}

