import { ErrorRequestHandler } from "express";
import StatusCodes from "../utils/statusCodes";
import CustomError from "../errors/custom.error";

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  return res.status(StatusCodes.INTERNAL).json({ message: 'Internal server error' });
}

export default errorMiddleware;