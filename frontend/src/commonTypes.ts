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