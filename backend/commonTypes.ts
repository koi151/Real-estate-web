export type RoomType = "bedrooms" | "bathrooms" | "kitchens" | "livingRooms";
export type ValidStatus = 'active' | 'inactive' | 'pending';
export type ValidMultiChangeType = 'active' | "inactive" | "position" | "delete" 

export const postTypeValues = ["standard", "premium", "exclusive"];
export const listingTypeValues = ["forSale", "forRent"];
export const statusValues = ["active", "inactive", "pending"];
export const accountTypeValues = ['admin', 'client']

// STATISTICS
export interface Statistics {
  total?: number;
  active?: number;
  inactive?: number;
}

export interface DashboardStatistics {
  adminAccounts: Statistics;
  clientAccounts: Statistics;
  properties: Statistics;
  categories: Statistics;
}

// PROPERTY INFO
export interface Location {
  city?: string;
  district?: string;
  ward?: string,
  address?: string;
}

export interface PropertyDetails {
  propertyCategory?: string;
  furnitures?: string;
  houseDirection?: string;
  balconyDirection?: string;
  legalDocuments?: string[];
  rooms?: string[];
  totalFloors?: number;
}

export interface PostServices {
  defaultPostFeePerDay: number | null,
  pushTimesLeft: number | null;
  dayPost?: number | null,
  discountPercentage: number | null;
}

export interface PropertyType {
  _id?: string;
  title: string;
  status?: ValidStatus;
  postType?: string;
  position?: number | null;
  description: any,
  area?: {
    propertyWidth: number | null;
    propertyLength: number | null;
  },
  view?: number | null;
  price?: number | null;
  images?: string[];
  location?: Location;
  listingType?: string;
  propertyDetails?: PropertyDetails;
  createdBy? : {
    accountId: string,
    accountType: 'admin' | 'client' | undefined,
    phone: string,
    fullName: string,
    email: string
  };  
  postServices?: PostServices; 
  slug?: string;
  createdAt?: Date;
  expireTime?: Date | string;
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
  userName: string,
  fullName: string,
  password: string,
  token?: string,
  email?: string,
  role_id?: string,
  phone?: string,
  avatar?: string,
  postList?: string[],
  favoriteList? : string[],
  status?: ValidStatus,
  createdAt?: Date;
  expireAt?: Date;
  deleted?: boolean;
  roleTitle?: string;
}

// CLIENT ACCOUNT
export interface AccountWalletType {
  balance: number,  
}

export interface SocialNetwork {
  zaloLink: string
}

export interface ClientAccountType {
  _id?: string;
  userName: string,
  fullName: string,
  password: string,
  token?: string,
  email?: string,
  phone?: string,
  avatar?: string,
  postList?: string[],
  favoritePosts? : string[],
  social?: SocialNetwork, 
  wallet?: AccountWalletType,
  status?: ValidStatus,
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// LOGIN & REGISTER
export interface AccountLoginType {
  email: string,
  password: string,
}

export interface AccountRegisterType {
  userName: string,
  email: string,
  password: string,
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

// AVAILABLE PERMISSIONS

export interface AdminPermissions {
  administratorRolesCreate: boolean;
  administratorRolesDelete: boolean;
  administratorRolesEdit: boolean;
  administratorRolesView: boolean;

  administratorAccountsCreate: boolean;
  administratorAccountsDelete: boolean;
  administratorAccountsEdit: boolean;
  administratorAccountsView: boolean;

  propertiesCreate: boolean;
  propertiesDelete: boolean;
  propertiesEdit: boolean;
  propertiesView: boolean;

  propertyCategoriesCreate: boolean;
  propertyCategoriesDelete: boolean;
  propertyCategoriesEdit: boolean;
  propertyCategoriesView: boolean;
}

// Custom role request type - FE accepts from BE
export interface RoleTitleType {
  _id: string,
  title: string
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


//// PROPERTIES FILTERING 
interface PropertyDetailsFilter {
  propertyCategory?: string;
  houseDirection?: string;
}

interface PriceRange {
  $gte?: number;
  $lte?: number;
}

export interface FindCriteria {
  deleted?: boolean;
  listingType?: string;
  accountId?: string;
  price?: PriceRange;
  status?: string;
  propertyDetails?: PropertyDetailsFilter;
  title?: RegExp;
  slug?: RegExp;
}

// COOKIES
export interface CookieOptions {
  expires?: number; 
  path?: string; 
}

// ORDER
// DEPOSIT BALANCE
export interface DepositOrderType {
  amount?: string,
  bankCode: string,
  language: string
}