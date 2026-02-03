import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => err.msg);

    res.status(400).json({
      success: false,
      error: formattedErrors.join(", "),
    });
    return;
  }

  next();
};
