import { convertToSlug } from "./convertToSlug";

// searchHelper.ts
interface SearchObject {
  keyword: string,
  regex?: RegExp,
  slugRegex?: RegExp
}

export const searchHelper = (query: any): SearchObject => {
  try {
    let searchObject: SearchObject = { keyword: "" }
    if (query.keyword) {
      const keywordRegex = new RegExp(query.keyword, "i");

      const unicodeSlug = convertToSlug(query.keyword);
      const slugRegex = new RegExp(unicodeSlug, "i");

      searchObject.keyword = query.keyword;
      searchObject.regex = keywordRegex;
      searchObject.slugRegex = slugRegex;
    }

    console.log("searchObject:", searchObject)
    return searchObject;

  } catch (error) {
    console.log('Error occurred in searchHelper:', error);
    return { keyword: "" };
  }
}
