import { PaginationObject } from '../commonTypes'

export const paginationHelper = (
  objectPagination: PaginationObject,
  query: any,
  countRecords: number
): PaginationObject => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  if (query.limit) {
    objectPagination.limitItems = parseInt(query.limit);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;

  return objectPagination;
};
