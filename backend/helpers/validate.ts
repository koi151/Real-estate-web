import { Response } from "express";

export const validateStringField = (value: any, fieldName: string, res: Response): boolean => {
  if (typeof value === 'string' || value === undefined) return true;

  res.json({
    code: 400,
    error: true,
    message: `${fieldName} must be a string`,
  });
  return false;
};

export const validateNumberField = (value: any, fieldName: string, res: Response): boolean => {
  if (!value) 
    return true;

  const newVal = parseFloat(value);
  if (isNaN(newVal)) {
    res.json({
      code: 400,
      error: true,
      message: `${fieldName} must be a number`,
    });
    return false;
  }
  return true
};

export const validateArrayField = (value: any[], fieldName: string, res: Response): boolean => {
  if (Array.isArray(value) || value === undefined) return true;

  res.json({
    code: 400,
    error: true,
    message: `${fieldName} must be an array`,
  });
  return false;
};

export const validateDateField = (value: any[], fieldName: string, res: Response): boolean => {
  if (!value || value instanceof Date) 
    return true;

  res.json({
    code: 400,
    error: true,
    message: `${fieldName} must be date type`,
  });
  return false;
};