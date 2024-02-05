import { Request, Response, NextFunction } from "express";
import { validateStringField } from "../../../../helpers/validate";

const validateField = (data: any, field: string, res: Response): boolean => {
  switch (field) {
    case 'title':
    case 'description':
      return validateStringField(data[field], field.charAt(0).toUpperCase() + field.slice(1), res);

    default:
      return true;
  }
};

export const createAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['title', 'description'];

  if (!req.body.title) {
    res.json({
      code: 400,
      message: `Title must not be empty`,
    });
    return;
  }

  if (req.body.title.length < 5) {
    res.json({
      code: 400,
      error: true,
      message: 'Title must be at least 5 characters long',
    });
    return;
  }

  for (const field of requiredFields) {
    console.log(field)
    if (!validateField(req.body, field, res)) {
      return;
    }
  }

  next();
};
