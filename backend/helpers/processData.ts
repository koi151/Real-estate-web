import { Request } from "express";
import { AccountLoginType, AccountRegisterType, AdminAccountType, ClientAccountType, PropertyCategoryType, PropertyType, RolesType } from "../commonTypes";
import bcrypt from 'bcrypt';
import sanitizeHtml from 'sanitize-html';

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
    title: req.body.title && sanitizeHtml(req.body.title),
    status: req.body.status,
    postType: req.body.postType && sanitizeHtml(req.body.postType),
    position: parseToValidNumber(req.body.position),
    description: req.body.description && sanitizeHtml(req.body.description),
    area: {
      propertyWidth: parseToValidNumber(req.body.area?.propertyWidth),
      propertyLength: parseToValidNumber(req.body.area?.propertyLength),
    },
    price: parseToValidNumber(req.body.price),
    location: {
      city: req.body.location?.city && sanitizeHtml(req.body.location.city),
      district: req.body.location?.district && sanitizeHtml(req.body.location.district),
      ward: req.body.location?.ward && sanitizeHtml(req.body.location.ward),
      address: req.body.location?.address && sanitizeHtml(req.body.location?.address),
    },
    listingType: req.body.listingType && sanitizeHtml(req.body.listingType),
    propertyDetails: {
      propertyCategory: req.body.propertyDetails?.propertyCategory && sanitizeHtml(req.body.propertyDetails.propertyCategory),
      houseDirection: req.body.propertyDetails?.houseDirection && sanitizeHtml(req.body.propertyDetails?.houseDirection),
      balconyDirection: req.body.propertyDetails?.balconyDirection && sanitizeHtml(req.body.propertyDetails?.balconyDirection),
      legalDocuments: req.body.propertyDetails?.legalDocuments && Array.isArray(req.body.propertyDetails.legalDocuments)
        ? req.body.propertyDetails.legalDocuments.filter(Boolean)
        : req.body.propertyDetails?.legalDocuments 
        ? [req.body.propertyDetails.legalDocuments]
        : undefined,
      furnitures: req.body.propertyDetails?.furnitures && sanitizeHtml(req.body.propertyDetails?.furnitures),
      totalFloors: req.body.propertyDetails?.totalFloors && parseInt(req.body.propertyDetails?.totalFloors),
      rooms: req.body.propertyDetails?.rooms && Array.isArray(req.body.propertyDetails.rooms)
        ? req.body.propertyDetails.rooms.filter(Boolean)
        : req.body.propertyDetails?.rooms 
        ? [req.body.propertyDetails.rooms]
        : undefined
    },
    postServices: {
      dayPost: req.body.postServices?.dayPost && parseToValidNumber(req.body.postServices.dayPost),
      pushTimesLeft: req.body.postServices?.pushTimesLeft && parseToValidNumber(req.body.postServices.pushTimesLeft),
      defaultPostFeePerDay: req.body.postServices?.defaultPostFeePerDay && parseToValidNumber(req.body.postServices.defaultPostFeePerDay),
      discountPercentage: req.body.postServices?.discountPercentage && parseToValidNumber(req.body.postServices.discountPercentage)
    },
    expireTime: req.body.expireTime && new Date(req.body.expireTime)
  };
};

// Category
export const processCategoryData = (req: Request): PropertyCategoryType => {
  req.body = processRequestBody(req.body);

  return {
    title: req.body.title && sanitizeHtml(req.body.title),
    status: req.body.status,
    position: parseFloat(req.body.position),
    description: req.body.description && sanitizeHtml(req.body.description),
    parent_id: req.body.parent_id && sanitizeHtml(req.body.parent_id),
    // images: Array.isArray(req.body.images) ? req.body.images : [req.body.images]
  };
}

// Admin role
export const processRoleData = (req: Request): RolesType => {
  return {
    title: req.body.title && sanitizeHtml(req.body.title),
    description: req.body.description && sanitizeHtml(req.body.description),
    permissions: Array.isArray(req.body.permissions) && req.body.permissions.length > 0 ? req.body.permissions : [req.body.permissions].filter(Boolean)
  };
}

// Admin account
export const processAdminAccountData = async (req: Request): Promise<AdminAccountType> => {
  req.body = processRequestBody(req.body);
  
  const hashedPassword = req.body.password 
    && await bcrypt.hash(sanitizeHtml(req.body.password), parseInt(process.env.SALT_ROUNDS));
  
  return {
    userName: req.body.userName && sanitizeHtml(req.body.userName),
    fullName: req.body.fullName && sanitizeHtml(req.body.fullName),
    email: req.body.email && sanitizeHtml(req.body.email),
    password: hashedPassword,
    status: req.body.status,
    phone: req.body.phone && sanitizeHtml(req.body.phone),
    role_id: req.body.role_id && sanitizeHtml(req.body.role_id),
    avatar: req.body.images && sanitizeHtml(req.body.images)
  };
}

// Client account
export const processClientAccountData = async (req: Request): Promise<ClientAccountType> => {
  req.body = processRequestBody(req.body);
  
  const hashedPassword = req.body.password 
    && await bcrypt.hash(sanitizeHtml(req.body.password), parseInt(process.env.SALT_ROUNDS));
  
  return {
    userName: req.body.userName && sanitizeHtml(req.body.userName),
    fullName: req.body.fullName && sanitizeHtml(req.body.fullName),
    email: req.body.email && sanitizeHtml(req.body.email),
    password: hashedPassword,
    status: req.body.status,
    phone: req.body.phone && sanitizeHtml(req.body.phone),
    avatar: req.body.images && sanitizeHtml(req.body.images),
    social: {
      zaloLink: req.body.social?.zaloLink && sanitizeHtml(req.body.social.zaloLink),
    },
    postList: Array.isArray(req.body.postList) ? req.body.postList : [req.body.postList],
    favoritePosts: Array.isArray(req.body.favoritePosts) ? req.body.favoritePosts : [req.body.favoritePosts],
    wallet: {
      balance: req.body.wallet?.balance && parseFloat(req.body.position),
    },
    createdAt: req.body.createdAt && new Date(req.body.createdAt),
    updatedAt: req.body.updatedAt && new Date(req.body.updatedAt),
  };
}

// Login data
export const processAccountLoginData = async (req: Request): Promise<AccountLoginType> => {
  return {
    email: req.body.loginEmail && sanitizeHtml(req.body.loginEmail),
    password: req.body.loginPassword && sanitizeHtml(req.body.loginPassword),
  };
}

// Register data
export const processAccountRegisterData = async (req: Request): Promise<AccountRegisterType> => {
  const hashedPassword = req.body.registerPassword 
  && await bcrypt.hash(sanitizeHtml(req.body.registerPassword ), parseInt(process.env.SALT_ROUNDS));
  
  return {
    userName: req.body.userName && sanitizeHtml(req.body.userName),
    email: req.body.registerEmail && sanitizeHtml(req.body.registerEmail),
    password: hashedPassword,
    wallet: {
      balance: 0
    }
  };
}