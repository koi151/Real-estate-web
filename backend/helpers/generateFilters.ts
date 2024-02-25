// bedrooms filter
export const generateBedroomsFilter = (bedrooms: any): object[] => {
  if (!bedrooms) return [];

  const gte = bedrooms.includes('bedrooms-gte') ? bedrooms?.charAt(bedrooms.length - 1) : undefined;
  const regexStringGTE = gte ? `^bedrooms-(?=.*[${gte}-99])\\d+$` : undefined;

  return regexStringGTE ?
    [{
      "propertyDetails.rooms": {
          $elemMatch: {
            $regex: new RegExp(regexStringGTE)
          }
      }
    }]
    : [{
      "propertyDetails.rooms": {
        $elemMatch: { $eq: bedrooms }
      }
    }];
}

// //price range filter
export const generatePriceRangeFilter = (priceRangeQuery: any): object[] => {
  const priceRange: number[] | undefined = (priceRangeQuery as string[])?.map(Number);
  return priceRange 
    ? [{ price: { $gte: priceRange[0], $lte: priceRange[1] } }] 
    : [] 
}
