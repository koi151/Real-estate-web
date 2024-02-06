export type RoomType = "bedrooms" | "bathrooms" | "kitchens" | "livingRooms";
export type ValidStatus = 'active' | 'inactive';
export type ValidMultiChangeType = 'active' | "inactive" | "position" | "delete" 

export const postTypeValues = ["default", "preminum", "featured"];
export const listingTypeValues = ["forSale", "forRent"];
export const statusValues = ["active", "inactive"];

// PROPERTY INFO
export interface Location {
  city?: string;
  district?: string;
  ward?: string,
  address?: string;
}

export interface PropertyDetails {
  subType?: string;
  features?: string[];
  propertyCategory?: string;
}

export interface PropertyType {
  _id?: string;
  title: string;
  status?: ValidStatus;
  postType?: {
    type: String,
    default: "default",
    enum: typeof postTypeValues,
  },
  position?: number;
  description: any,
  area?: {
    propertyWidth: number;
    propertyLength: number;
  },
  view?: number;
  price?: number;
  images?: string[];
  location?: Location;
  listingType?: string;
  propertyDetails?: PropertyDetails;
  slug?: string;
  createdAt?: Date;
  expireAt?: Date;
  deleted?: boolean;
}

// PROPERTY CATEGORIES
export interface PropertyCategoryType {
  _id?: string;
  title: string;
  status?: ValidStatus;
  position?: number;
  description?: any,
  parent_id?: string,
  images?: string[];
  slug?: string;
  createdAt?: Date;
  expireAt?: Date;
  deleted?: boolean;
}

// ADMIN ACCOUNT
export interface AdminAccountType {
  _id?: string;
  fullName: string,
  password: string,
  email: string,
  token: string,
  role_id?: string,
  phone?: string,
  avatar?: string,
  status?: ValidStatus,
  createdAt?: Date;
  expireAt?: Date;
  deleted?: boolean;
  roleTitle?: string;
}

// TREE
export interface TreeNode {
  _id?: string;
  title: string;
  parent_id?: string;
}

export interface TreeSelectNode {
  value: string;
  title: string;
  children?: TreeSelectNode[];
}

// ADMIN ROLES
export interface RolesType {
  _id?: string;
  title: string;
  description?: string;
  permissions?: string[];
  deleted?: boolean;
  createdAt?: Date;
  updateAt?: Date;
}

export interface SortingQuery {
  sortKey: string;
  sortValue: string;
}

// PAGINATION 
export interface PaginationObject {
  currentPage: number | null; 
  limitItems: number | null; 
  skip: number | null;
  totalPage: number | null;
}

// ADMIN SERVICE
export interface GetPropertiesOptions {
  params?: Record<string, any>;
  pageSize?: number;
  currentPage?: number;
}