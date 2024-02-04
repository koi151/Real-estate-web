import { ValidStatus } from "../commonTypes";

export const isValidStatus = (status: string): status is ValidStatus => status === 'active' || status === 'inactive';