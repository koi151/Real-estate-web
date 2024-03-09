import { Request, Response } from "express";

import Property from "../../models/property.model";

import { generateAreaRangeFilter, generateFilterInRange, generateRoomFilter  } from "../../../../helpers/generateFilters";
import { FindCriteria } from "../../../../commonTypes";
import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from "../../../../helpers/pagination";


// [GET] /properties
export const index = async (req: Request, res: Response) => {
  try {
    const status = req.query.status?.toString() as string | undefined;
    const category = req.query.category?.toString() as string | undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : null;
    const listingType = req.query.listingType?.toString() as string | undefined;
    const direction = req.query.direction?.toString() as string | undefined;

    const find: FindCriteria = {
      deleted: false,
      ...(status && { status }),
      ...(listingType && { listingType }),
      ...(direction && {  "propertyDetails.houseDirection": direction  }),
      ...(category && { "propertyDetails.propertyCategory": category }),
      ...generateRoomFilter(req.query.bedrooms, 'bedrooms'),
      ...generateRoomFilter(req.query.bathrooms, 'bathrooms'),
      ...generateFilterInRange(req.query.priceRange, 'price'),
      ...generateAreaRangeFilter(req.query.areaRange, 'area.propertyLength', 'area.propertyWidth'),
    };

    // Searching
    const searchObject = searchHelper(req.query);
    const { regex, slugRegex } = searchObject;

    if (regex) {
      const orClause = { $or: [{ title: regex }, { slug: slugRegex }] };
      Object.assign(find, orClause);
    }

    // Pagination
    const countRecords = await Property.countDocuments(find);
    let paginationObject = paginationHelper(
      {
        currentPage: typeof req.query.currentPage == "string" ? parseInt(req.query.currentPage) : 1,
        limitItems: pageSize,
        skip: null, // helper return skip, totalPage value, do not change
        totalPage: null,
      },
      req.query,
      countRecords
    );

    // Sorting 
    interface SortingQuery {
      [key: string]: 'asc' | 'desc';
    } 
    
    const sortingQuery: SortingQuery = {};

    if (req.query.sortKey && req.query.sortValue ) { //&& req.query.sortKey !== 'area'
      sortingQuery[req.query.sortKey.toString()] = req.query.sortValue.toString() as 'asc' | 'desc';
    }

    let properties = [];
    let propertyCount: number = 0;
    
    // Calculate area and add it to sorting query
    // if (req.query.sortKey === 'area') {
    //   const areaSortValue = sortingQuery['area'];
    
    //   const areaSortingPipeline: any[] = [
    //     {
    //       $addFields: {
    //         newArea: { $multiply: ['$area.propertyWidth', '$area.propertyLength'] }
    //       }
    //     },
    //     { $sort: { area: areaSortValue === 'asc' ? 1 : -1 } }
    //   ];
      
    //   properties = await Property.aggregate([
    //     { $match: find },
    //     ...areaSortingPipeline,
    //     { $limit: paginationObject.limitItems || 0 },
    //     { $skip: paginationObject.skip || 0 }
    //   ]);

    //   console.dir(areaSortingPipeline, {depth: null})
    
    //   // Count documents after sorting
    //   const countResult = await Property.aggregate([
    //     { $match: find },
    //     { $count: 'count' }
    //   ]);
    //   propertyCount = countResult.length > 0 ? countResult[0].count : 0;

    // } else {

      console.log("sortingQuery:", sortingQuery)


      console.dir(find, {depth: null})

      properties = await Property.find(find)
        .sort(sortingQuery || '')
        .limit(paginationObject.limitItems || 0)
        .skip(paginationObject.skip || 0);
 
      propertyCount = await Property.countDocuments(find);
    // }
    

    res.status(200).json({
      code: 200,
      message: 'Success',
      properties: properties,
      paginationObject: paginationObject,
      propertyCount: propertyCount,
    });

  } catch (error) {
    console.log('Error occurred while fetching properties data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [GET] /properties/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    // if (!res.locals.currentUser.permissions.includes('properties_view')) {
    //   return res.json({
    //     code: 403,
    //     message: "Account does not have access rights"
    //   })
    // }

    const id: string | undefined = req.params.id;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid property ID'
      });
    }

    const property = await Property.findOne(
      { _id: id }, 
      { deleted: false }
    )

    if (property) {
      res.status(200).json({
        code: 200,
        message: "Success",
        property: property
      })
    } else {
      res.status(400).json({
        code: 400,
        message: "Property not found"
      })
    }

  } catch (error) {
    console.log('Error occurred while fetching property data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}