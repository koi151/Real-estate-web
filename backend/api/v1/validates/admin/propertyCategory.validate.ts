import { Request, Response, NextFunction } from "express";
import { validateArrayField, validateNumberField, validateStringField } from "../../../../helpers/validate";

const validateField = (data: any, field: string, res: Response): boolean => {
  switch (field) {
    case 'title':
    case 'status':
    case 'description':
      return validateStringField(data[field], field.charAt(0).toUpperCase() + field.slice(1), res);

    case 'position':
      return validateNumberField(parseFloat(data[field]), field.charAt(0).toUpperCase() + field.slice(1), res);

    case 'images':
      return validateArrayField(data[field]?.features, 'Property features', res);

    default:
      return true;
  }
};

export const createProperty = (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['title','status', 'position', 'description', 'images'];

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
