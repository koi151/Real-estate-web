export const getAreaSortingPipeline = (query: any): any[] => {
  const areaSortValue: number = query["sortValue"] === 'asc' ? 1 : -1;
  if (!query || !areaSortValue) return [];

  return  [
    {
      $addFields: {
        newArea: { $multiply: ['$area.propertyWidth', '$area.propertyLength'] }
      }
    },
    { $sort: { newArea: areaSortValue } }
  ]
}