import { Request } from "express";
import { AdminAccountLogType, AdminAccountType, PropertyCategoryType, PropertyType, RolesType } from "../commonTypes";
import bcrypt from 'bcrypt';

/*  formData replace undefined fields to '' value,
this function reverse recursively back to normal value in FE */
export const processRequestBody = (body: any) => {
  const processNested = (obj: any) => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        processNested(obj[key]);
      } else if (obj[key] === '') {
        obj[key] = undefined;
      }
    });
  };

  processNested(body);
  return body;
};



export const parseToValidNumber = (value?: string | null | undefined): number | undefined => {
  return value ? parseFloat(value) || undefined : undefined;
};

// Images
export const processImagesData = (imageUrls: string[] | string | undefined): string[] => {
  return imageUrls ? (Array.isArray(imageUrls) ? imageUrls : [imageUrls]) : [];
};

// Property
export const processPropertyData = (req: Request): PropertyType => {
  req.body = processRequestBody(req.body);

  return {
    title: req.body.title && String(req.body.title),
    status: req.body.status,
    postType: req.body.postType && String(req.body.postType),
    position: parseToValidNumber(req.body.position),
    description: req.body.description && String(req.body.description),
    area: {
      propertyWidth: parseToValidNumber(req.body.area?.propertyWidth),
      propertyLength: parseToValidNumber(req.body.area?.propertyLength),
    },
    price: parseToValidNumber(req.body.price),
    location: {
      city: req.body.location?.city && String(req.body.location.city),
      district: req.body.location?.district && String(req.body.location.district),
      ward: req.body.location?.ward && String(req.body.location.ward),
      address: req.body.location?.address && String(req.body.location?.address),
    },
    listingType: req.body.listingType && String(req.body.listingType),
    propertyDetails: {
      propertyCategory: req.body.propertyDetails?.propertyCategory && String(req.body.propertyDetails.propertyCategory),
      houseDirection: req.body.propertyDetails?.houseDirection && String(req.body.propertyDetails?.houseDirection),
      balconyDirection: req.body.propertyDetails?.balconyDirection && String(req.body.propertyDetails?.balconyDirection),
      legalDocuments: req.body.propertyDetails?.legalDocuments && Array.isArray(req.body.propertyDetails.legalDocuments)
        ? req.body.propertyDetails.legalDocuments.filter(Boolean)
        : req.body.propertyDetails?.legalDocuments 
        ? [req.body.propertyDetails.legalDocuments]
        : undefined,
      furnitures: req.body.propertyDetails?.furnitures && String(req.body.propertyDetails?.furnitures),
      totalFloors: req.body.propertyDetails?.totalFloors && parseInt(req.body.propertyDetails?.totalFloors),
      rooms: req.body.propertyDetails?.rooms && Array.isArray(req.body.propertyDetails.rooms)
        ? req.body.propertyDetails.rooms.filter(Boolean)
        : req.body.propertyDetails?.rooms 
        ? [req.body.propertyDetails.rooms]
        : undefined
    },
    expireTime: req.body.expireTime && new Date(req.body.expireTime)
  };
};

// Category
export const processCategoryData = (req: Request): PropertyCategoryType => {
  req.body = processRequestBody(req.body);

  return {
    title: req.body.title && String(req.body.title),
    status: req.body.status,
    position: parseFloat(req.body.position),
    description: req.body.description && String(req.body.description),
    parent_id: req.body.parent_id && String(req.body.parent_id),
    images: Array.isArray(req.body.images) ? req.body.images : [req.body.images]
  };
}

// Admin role
export const processRoleData = (req: Request): RolesType => {
  return {
    title: req.body.title && String(req.body.title),
    description: req.body.description && String(req.body.description),
    permissions: Array.isArray(req.body.permissions) && req.body.permissions.length > 0 ? req.body.permissions : [req.body.permissions].filter(Boolean)
  };
}

// Admin account
export const processAdminAccountData = async (req: Request): Promise<AdminAccountType> => {
  req.body = processRequestBody(req.body);
  
  const hashedPassword = req.body.password 
    && await bcrypt.hash(String(req.body.password), parseInt(process.env.SALT_ROUNDS));
  
  return {
    fullName: req.body.fullName && String(req.body.fullName),
    email: req.body.email && String(req.body.email),
    password: hashedPassword,
    status: req.body.status,
    phone: req.body.phone && String(req.body.phone),
    role_id: req.body.role_id && String(req.body.role_id),
    avatar: req.body.images && String(req.body.images)
  };
}

// Admin account - Login && register
export const processAdminAccountLogData = async (req: Request): Promise<AdminAccountLogType> => {

  return {
    email: req.body.email && String(req.body.email),
    password: req.body.password && String(req.body.password),
  };
}