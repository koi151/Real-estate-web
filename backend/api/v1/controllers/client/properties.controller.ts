import { Request, Response } from "express";

import Property from "../../models/property.model";

import { generateAreaRangeFilter, generateFilterInRange, generateRoomFilter  } from "../../../../helpers/generateFilters";
import { getAreaSortingPipeline } from "../../../../helpers/generateSorting";
import { FindCriteria, PropertyType } from "../../../../commonTypes";
import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from "../../../../helpers/pagination";
import { processImagesData, processPropertyData } from "../../../../helpers/processData";
import ClientAccount from "../../models/clientAccount.model";


// [GET] /properties
export const index = async (req: Request, res: Response) => {
  try {
    // const user: any | undefined = res.locals.currentUserClient;

    // if (!user) {
    //   return res.json({
    //     code: 404,
    //     message: "User information not found"
    //   })
    // }
    const category = req.query.category?.toString() as string | undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : null;
    const listingType = req.query.listingType?.toString() as string | undefined;
    const direction = req.query.direction?.toString() as string | undefined;

    // In case of filtering favorite property posts -------------------
    const favoritePostIds: any | undefined = res.locals.currentUserClient && res.locals.currentUserClient.favoritePosts;

    // if (!favoritePostIds) {
    //   return res.json({
    //     code: 400,
    //     message: 'No favorited post found'
    //   })
    // }
    // -------------------------------------

    const find: FindCriteria = {
      deleted: false,
      status: "active",    
      ...(req.query.favorited && { _id: { $in: favoritePostIds } }),
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
        currentPage: typeof req.query.currentPage === "string" ? parseInt(req.query.currentPage) : 1,
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

    let properties = [];
    let propertyCount: number = 0;

    // Sorting by area is more complex than usual sort => split to specific case 
    if (req.query.sortKey === 'area') {
      const areaSortingPipeline: any[] = getAreaSortingPipeline(req.query) 
      const advancedSortArray = [
        { $match: find },
        ...areaSortingPipeline,
        { $skip: paginationObject.skip || 0 },
        { $limit: paginationObject.limitItems || 0 },
      ]

      properties = await Property.aggregate(advancedSortArray)

    } else {

      if (req.query.sortKey && req.query.sortValue) {
        sortingQuery[req.query.sortKey.toString()] = req.query.sortValue.toString() as 'asc' | 'desc';
      }

      properties = await Property.find(find)
        .sort(sortingQuery || '')
        .skip(paginationObject.skip || 0)
        .limit(paginationObject.limitItems || 0)
    }

    propertyCount = await Property.countDocuments(find)

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
}


// [GET] /properties/my-property
export const myProperty = async (req: Request, res: Response) => {
  try {
    const postList: string | undefined = res.locals.currentUserClient?.postList;

    if (!postList) {
      return res.json({
        code: 200,
        message: "No post found"
      })
    }

    const category = req.query.category?.toString() as string | undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : null;
    const listingType = req.query.listingType?.toString() as string | undefined;
    const direction = req.query.direction?.toString() as string | undefined;

    const find: FindCriteria = {
      deleted: false,
      status: 'active',
      ...(listingType && { listingType }),
      ...(postList && { _id: { $in: postList } }),
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
        currentPage: typeof req.query.currentPage === "string" ? parseInt(req.query.currentPage) : 1,
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

    let properties = [];
    let propertyCount: number = 0;

    // Sorting by area is more complex than usual sort => split to specific case 
    if (req.query.sortKey === 'area') {
      const areaSortingPipeline: any[] = getAreaSortingPipeline(req.query)

      properties = await Property.aggregate([ // Advanced queries
        { $match: find },
        ...areaSortingPipeline,
        { $skip: paginationObject.skip || 0 },
        { $limit: paginationObject.limitItems || 0 },
      ]);

    } else { // other filters without sorting by area

      if (req.query.sortKey && req.query.sortValue) {
        sortingQuery[req.query.sortKey.toString()] = req.query.sortValue.toString() as 'asc' | 'desc';
      }

      properties = await Property.find(find)
        .sort(sortingQuery || '')
        .skip(paginationObject.skip || 0)
        .limit(paginationObject.limitItems || 0)
    }

    propertyCount = await Property.countDocuments(find);

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

// [GET] /properties/my-properties/detail/:id
export const myPropertyDetail = async (req: Request, res: Response) => {
  try {
    const postId: string | undefined = req.params.id;
    if (!postId) {
      return res.json({
        code: 404,
        message: "Invalid property post ID"
      }) 
    }

    const accessAllowed: boolean = res.locals.currentUserClient.postList.includes(postId);

    if (!accessAllowed) {
      return res.json({
        code: 404,
        message: "Account does not have permission to access this post data"
      })
    }

    const property = await Property.findOne({
      _id: postId,
      deleted: false,
    })

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

// [POST] /properties/create
export const createPost = async (req: any, res: Response) => {
  try {
    console.log("start creating")
    console.log("res.locals.currentUserClient:", res.locals.currentUserClient)
    const accountId: string | undefined = res.locals.currentUserClient
      ? res.locals.currentUserClient._id?.toString()
      : undefined;

    if (!accountId) {
      return res.json({
        code: 404,
        message: "Can not get account ID"
      })
    }

    const property: PropertyType = processPropertyData(req);
    const processedImages = processImagesData(req.body.images);

    if (!property.position) {
      const cntProperty = await Property.countDocuments();
      property.position = cntProperty + 1;
    }

    const propertyWithImages = processedImages 
    ? { ...property, images: processedImages, status: 'pending' } 
    : { ...property, status: 'pending' };

    console.log("propertyWithImages:", propertyWithImages)

    const newProperty = new Property(propertyWithImages);
    await newProperty.save();

    console.log('created')

    const updateResult = await ClientAccount.updateOne(
      { _id: accountId }, 
      { $addToSet: { postList: newProperty._id } } 
    );

    console.log('addded to set')
    
    if (updateResult) {
      return res.status(200).json({
        code: 200,
        message: "Created new property successfully"
      })
    }

    return res.json({
      code: 400,
      message: "Add post id to client account post list failed, created new post"
    }) 

  } catch (error) {
    console.log('Error occurred while creating property:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /properties/my-properties/edit/:id
export const myPropertyDetailPatch = async (req: Request, res: Response) => {
  try {  
    const postId: string | undefined = req.params.id;
    if (!postId) {
      return res.json({
        code: 404,
        message: "Invalid property post ID"
      }) 
    }

    const accessAllowed: boolean = res.locals.currentUserClient.postList.includes(postId);

    if (!accessAllowed) {
      return res.json({
        code: 404,
        message: "Account does not have permission to access this post data"
      })
    }

    const propertyUpdated: PropertyType = processPropertyData(req);
    const processedImages = processImagesData(req.body.images);
    const imagesToRemove = processImagesData(req.body.images_remove);

    if (!propertyUpdated.position) {
      const cntProperty = await Property.countDocuments();
      propertyUpdated.position = cntProperty + 1;
    }

    await Property.updateOne(
      { _id: postId },
      { 
        $set: propertyUpdated,  // Update non-image fields
        $push: { images: { $each: processedImages }} // Push new images
      }
    );
    
    // Remove specified images
    await Property.updateOne(
      { _id: postId },
      { $pull: { images: { $in: imagesToRemove }}} // Remove specified images
    );

    res.status(200).json({
      code: 200,
      message: 'Property post updated successfully'
    })

  } catch (error) {
    console.log('Error occurred while editing property post:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}