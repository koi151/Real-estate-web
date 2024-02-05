import { Request } from "express";
import { PropertyCategoryType, PropertyType, RolesType } from "../commonTypes";

export const parseToValidNumber = (value?: string | null | undefined): number | undefined => {
  return value ? parseFloat(value) || undefined : undefined;
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
      features: Array.isArray(req.body.propertyDetails?.features) ? req.body.propertyDetails?.features : [req.body.propertyDetails?.features || ''],
    },
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
    permissions: req.body.permissions?.length > 0 && Array(req.body.permissions),
  };
}