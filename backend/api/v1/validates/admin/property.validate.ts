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

  if (field === 'area' || field === 'position' || field === 'price') {
    if (!validateNumberField(data[field], field.charAt(0).toUpperCase() + field.slice(1), res)) {
      return false;
    }
  }

  return true;
};

const validateNumberField = (value: any, fieldName: string, res: Response) => {
  if (!/^\d+$/.test(value)) {
    res.status(400).json({
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
};
