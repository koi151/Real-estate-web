export type RoomType = "bedrooms" | "bathrooms" | "kitchens" | "livingRooms";

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

export interface Property {
  _id: string;
  title: string;
  area?: {
    width: number;
    length: number;
  },
  status?: string;
  view?: number;
  price?: string;
  images?: string[];
  location?: Location;
  listingType?: string;
  propertyDetails?: PropertyDetails;
  createdAt?: Date;
  expireAt?: Date;
}

export interface SortingQuery {
  sortKey: string;
  sortValue: string;
}

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
