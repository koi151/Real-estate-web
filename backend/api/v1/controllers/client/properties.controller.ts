import { Request, Response } from "express";

import Property from "../../models/property.model";

// [GET] /properties
export const index = async (req: Request, res: Response) => {
  try {
    // if (!res.locals.currentUser.permissions.includes('properties_view')) {
    //   return res.json({
    //     code: 403,
    //     message: "Account does not have access rights"
    //   })
    // }

    // interface Find {
    //   deleted?: boolean | null,
    //   listingType?: string | null,
    //   price?: { $gte: number; $lte: number } | null;
    //   status?: string | null,
    //   'propertyDetails.propertyCategory'?: string | null;
    //   title?: RegExp | null,
    //   slug?: RegExp | null
    // }
    
    // let status: string | undefined = req.query.status?.toString();
    // let category: string | undefined = req.query.category?.toString();
    // const pageSize: number | null = req.query.pageSize ? parseInt(req.query.pageSize as string) : null;

    // let listingType: string | undefined = req.query.listingType?.toString();
    // let priceRange: number[] | undefined = (req.query.priceRange as string[])?.map(Number);
    
    // const find: Find = {
    //   deleted: false,
    //   ...(status && { status }),
    //   ...(listingType && { listingType }),
    //   ...(category && { 'propertyDetails.propertyCategory': category }),
    //   ...(priceRange && { price: { $gte: priceRange[0], $lte: priceRange[1] } }),
    // };

    // // Searching
    // const searchObject = searchHelper(req.query);
    // const { regex, slugRegex } = searchObject;

    // if (regex) {
    //   const orClause = { $or: [{ title: regex }, { slug: slugRegex }] };
    //   Object.assign(find, orClause);
    // }    

    // // Pagination
    // const countRecords = await Property.countDocuments(find);
    // let paginationObject = paginationHelper(
    //   {
    //     currentPage: typeof(req.query.currentPage) == "string" ? parseInt(req.query.currentPage) : 1,
    //     limitItems: pageSize,
    //     skip: null, // helper return skip, totalPage value, do not change
    //     totalPage: null,
    //   },
    //   req.query,
    //   countRecords
    // );

    // // Sorting 
    // interface SortingQuery {
    //   [key: string]: 'asc' | 'desc';
    // } 
    
    // const sortingQuery: SortingQuery = {};
    
    // if (req.query.sortKey && req.query.sortValue) {
    //   sortingQuery[req.query.sortKey.toString()] = req.query.sortValue.toString() as 'asc' | 'desc';
    // }

    // const properties = await Property.find(find)
    //   .sort(sortingQuery || '')
    //   .limit(paginationObject.limitItems || 0)
    //   .skip(paginationObject.skip || 0);

    const properties = await Property.find({
      deleted: false
    })

    // const propertyCount = await Property.countDocuments(find);
    const propertyCount = await Property.countDocuments({
      deleted: false
    });


    // if (properties.length > 0) {
    //   res.status(200).json({
    //     code: 200,
    //     message: 'Success',
    //     properties: properties,
    //     paginationObject: paginationObject,
    //     propertyCount: propertyCount,
    //     permissions: {
    //       propertiesView: res.locals.currentUser.permissions.includes('properties_view'),
    //       propertiesEdit: res.locals.currentUser.permissions.includes('properties_edit'),
    //       propertiesCreate: res.locals.currentUser.permissions.includes('properties_create'),
    //       propertiesDelete: res.locals.currentUser.permissions.includes('properties_delete')
    //     }
    //   });

    if (properties.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        properties: properties,
        propertyCount: propertyCount,
      });

    } else {
      // res.json({
      //   code: 200,
      //   message: 'No properties found',
      //   properties: properties,
      //   paginationObject: paginationObject,
      //   propertyCount: propertyCount,
      //   permissions: {
      //     propertiesView: res.locals.currentUser.permissions.includes('properties_view'),
      //     propertiesEdit: res.locals.currentUser.permissions.includes('properties_edit'),
      //     propertiesCreate: res.locals.currentUser.permissions.includes('properties_create'),
      //     propertiesDelete: res.locals.currentUser.permissions.includes('properties_delete')
      //   }
      // });

      res.json({
        code: 200,
        message: 'No properties found',
        properties: properties,
        propertyCount: propertyCount,
      });
    }

  } catch (error) {
    console.log('Error occurred while fetching properties data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

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