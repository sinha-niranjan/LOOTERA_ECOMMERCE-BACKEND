import { User } from "../models/user.js";
import ErrorHandler from "../utils/utilityClass.js";
import { TryCatch } from "./error.js";

// MIDDLEWARE TO MAKE SURE ONLY ADMIN IS ALLOWED ---------------------------------------------------------------------------
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please login first ", 401));

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Please enter a valid id", 401));

  if (user.role !== "admin")
    return next(
      new ErrorHandler("You are not authorized to do this action ", 401)
    );

  next();
});
