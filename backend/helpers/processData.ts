import { Request } from "express";
import { AdminAccountLogType, AdminAccountType, PropertyCategoryType, PropertyType, RolesType } from "../commonTypes";
import bcrypt from 'bcrypt';

export const parseToValidNumber = (value?: string | null | undefined): number | undefined => {
  return value ? parseFloat(value) || undefined : undefined;
};

// Images
export const processImagesData = (imageUrls: string[] | string | undefined): string[] => {
  return imageUrls ? (Array.isArray(imageUrls) ? imageUrls : [imageUrls]) : [];
};

// Property
export const processPropertyData = (req: Request): PropertyType => {
  return {
    title: req.body.title && String(req.body.title),
    status: req.body.status,
    postType: req.body.postType,
    position: parseToValidNumber(req.body.position),
    description: req.body.description || '',
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
      subType: req.body.propertyDetails?.subType && String(req.body.propertyDetails.subType),
      features: req.body.propertyDetails?.features && Array.isArray(req.body.propertyDetails.features)
        ? req.body.propertyDetails.features.filter(Boolean)
        : req.body.propertyDetails?.features 
        ? [req.body.propertyDetails.features]
        : undefined
    },
    expireTime: req.body.expireTime && new Date(req.body.expireTime)
  };
};

// Category
export const processCategoryData = (req: Request): PropertyCategoryType => {
  return {
    title: req.body.title && String(req.body.title),
    status: req.body.status,
    position: parseFloat(req.body.position),
    description: req.body.description && String(req.body.description),
    parent_id: req.body.parent_id && String(req.body.parent_id),
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
  const hashedPassword = req.body.password 
    && await bcrypt.hash(String(req.body.password), parseInt(process.env.SALT_ROUNDS));

  return {
    fullName: req.body.fullName && String(req.body.fullName),
    email: req.body.email && String(req.body.email),
    password: hashedPassword,
    token: req.body.token && String(req.body.token),
    status: req.body.status,
    phone: req.body.phone && String(req.body.phone),
    role_id: req.body.role_id && String(req.body.role_id),
  };
}

// Admin account - Login && register
export const processAdminAccountLogData = async (req: Request): Promise<AdminAccountLogType> => {

  return {
    email: req.body.email && String(req.body.email),
    password: req.body.password && String(req.body.password),
  };
}