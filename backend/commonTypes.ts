import { UploadFile } from "antd";

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
  ward?: String,
  address?: string;
}

export interface PropertyDetails {
  subType?: string;
  features?: string[];
  propertyType?: string;
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