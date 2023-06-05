import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

const handleInputErrors = (
  req: Request,
  res: Response,
  next: () => void
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ errors: errors.array() });
  } else {
    next();
  }
};

export default handleInputErrors;
