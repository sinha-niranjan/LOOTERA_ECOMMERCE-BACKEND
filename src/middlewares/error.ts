import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utilityClass.js";
import { ControllerType } from "../types/type.js";

export const errorMiddlware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal server Error ";
  err.statusCode = err.statusCode || 500;
  if (err.name === "CastError") err.message = "Invalid ID";
  return res.status(err.statusCode).json({
    success: false,
    err: err.message,
  });
};

export const TryCatch = (func: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
};
