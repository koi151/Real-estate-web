import { Request, Response, NextFunction } from "express";
import { validateArrayField, validateNumberField, validateStringField } from "../../../../helpers/validate";

const validateLocationField = (value: any, res: Response): boolean => {
  if (value === undefined) return true;

  const isValidString = (str: any) => typeof str === 'string' || str === undefined;

  if (
    isValidString(value.city) &&
    isValidString(value.district) &&
    isValidString(value.ward) &&
    isValidString(value.address)
  ) {
    return true;
  }

  res.json({
    code: 400,
    error: true,
    message: "Invalid location data",
  });
  return false;
};

const validateField = (data: any, field: string, res: Response): boolean => {
  switch (field) {
    case 'title':
    case 'status':
    case 'postType':
    case 'description':
    case 'listingType':
      return validateStringField(data[field], field.charAt(0).toUpperCase() + field.slice(1), res);

    case 'position':
    case 'price':
      return validateNumberField(parseFloat(data[field]), field.charAt(0).toUpperCase() + field.slice(1), res);

    case 'area':
      if (!data[field]?.propertyWidth && !data[field]?.propertyLength) 
        return true;

      const widthAsNumber = parseFloat(data[field]?.propertyWidth);
      const lengthAsNumber = parseFloat(data[field]?.propertyLength);
    
      if (isNaN(widthAsNumber) || isNaN(lengthAsNumber)) {
        res.json({
          code: 400,
          error: true,
          message: "Width and Length of property must be valid numbers",
        });
        return false;
      }
    
      return validateNumberField(widthAsNumber, 'Property width', res) && validateNumberField(lengthAsNumber, 'Property length', res);      

    case 'location':
      return validateLocationField(data[field], res);

    case 'propertyDetails':
    case 'images':
      return validateArrayField(data[field]?.features, 'Property features', res);

    default:
      return true;
  }
};

export const createProperty = (req: Request, res: Response, next: NextFunction) => {
  const requiredFields = 
    ['title','status', 'postType', 'area', 'price', 'position', 
    'description', 'listingType', 'location', 'propertyDetails', 'images'];

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
