import { Request, Response, NextFunction } from "express";

const validateField = (data: any, field: string, res: Response) => {
  if (!data[field]) {
    res.json({
      code: 400,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} must not be empty`,
    });
    return false;
  }

  if (field === 'title' && data.title.length < 5) {
    res.json({
      code: 400,
      error: true,
      message: 'Title must be at least 5 digits length',
    });
    return false;
  }

  if (field === 'position' || field === 'price') {
    if (!validateNumberField(data[field], field.charAt(0).toUpperCase() + field.slice(1), res)) {
      return false;
    }
  } else if (field === 'area') {
    if (data[field]?.propertyWidth && data[field]?.propertyLength) {
      validateNumberField(data[field].propertyWidth, 'Property width', res);
      validateNumberField(data[field].propertyLength, 'Property length', res);
    } else {
      res.json({
        code: 400,
        error: true,
        message: "Width and Length of property must be included"
      })
    }
 
  }
  return true;
};

const validateNumberField = (value: any, fieldName: string, res: Response) => {
  if (!/^\d+$/.test(value)) {
    res.json({
      code: 400,
      error: true,
      message: `${fieldName} must be a number`,
    });
    return false;
  }
  return true;
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = ['title', 'area', 'price', 'position'];

  for (const field of requiredFields) {
    if (!validateField(req.body, field, res)) {
      return;
    }
  }
  next();
}
