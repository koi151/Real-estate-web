interface SearchObject {
  keyword: string, 
  regex?: RegExp
}

export const searchHelper = (query: any): SearchObject => {
  try {
    let searchObject: SearchObject = {
      keyword: ""
    }

    if (query.keyword) {
      searchObject.keyword = query.keyword;

      const regex = new RegExp(searchObject.keyword, 'i')
      searchObject.regex = regex;
    }
    
    return searchObject;

  } catch (error) {
    console.log('Error occcurred in searchHelper:', searchHelper);
    return { 
      keyword: "" 
    };
  }
}