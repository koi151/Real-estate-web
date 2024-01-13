export type RoomType = "bedrooms" | "bathrooms" | "kitchens" | "livingRooms";
export type ValidStatus = 'active' | 'inactive';

// PROPERTY INFO
export interface Location {
  city?: string;
  district?: string;
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
  position?: number;
  description: string,
  area?: {
    width: number;
    length: number;
  },
  view?: number;
  price?: string;
  images?: string[];
  location?: Location;
  listingType?: string;
  propertyDetails?: PropertyDetails;
  createdAt?: Date;
  expireAt?: Date;
  deleted?: boolean;
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
