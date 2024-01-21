import { Request, Response, NextFunction } from "express";

const validateNumberField = (value: any, fieldName: string, res: Response): boolean => {
  if (!value) {
    return true;
  }
  
  if (!/^\d+$/.test(value)) {
    res.json({
      code: 400,
      error: true,
      message: `${fieldName} must be a number`,
    });
    return false;
  }
  return true;
};

const validateField = (data: any, field: string, res: Response): boolean => {
  switch (field) {
    case 'position':
    case 'price':
      return validateNumberField(data[field], field.charAt(0).toUpperCase() + field.slice(1), res);

    case 'area':
      const { propertyWidth, propertyLength } = data[field] || {};
      if (propertyWidth && propertyLength) {
        return (
          validateNumberField(propertyWidth, 'Property width', res) &&
          validateNumberField(propertyLength, 'Property length', res)
        );
      } else {
        res.json({
          code: 400,
          error: true,
          message: "Width and Length of property must be included",
        });
        return false;
      }

    default:
      return true;
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['title', 'area', 'price', 'position'];

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
    if (!validateField(req.body, field, res)) {
      return;
    }
  }

  next();
};
