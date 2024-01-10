export type RoomType = "bedrooms" | "bathrooms" | "kitchens" | "livingRooms";

export interface Location {
  city: string;
  district: string;
}

export interface PropertyDetails {
  subType: string;
  features: string[];
  propertyType: string;
}

export interface Property {
  title: string;
  area?: {
    width: number;
    length: number;
  },
  status?: string;
  price?: string;
  images?: string[];
  location?: Location;
  listingType?: string;
  propertyDetails?: PropertyDetails;
  createdAt?: Date;
  expireAt?: Date;
}