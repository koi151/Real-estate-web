import { Request, Response } from "express";
import { startOfDay, subDays } from 'date-fns';

import Property from "../../models/property.model";

import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from '../../../../helpers/pagination';
import { isValidStatus } from "../../../../helpers/dataTypeCheck";

import { FindCriteria, PropertyType, ValidMultiChangeType } from "../../../../commonTypes";
import { processImagesData, processPropertyData } from "../../../../helpers/processData";
import { generateAreaRangeFilter, generateFilterInRange, generateRoomFilter  } from "../../../../helpers/generateFilters";
import { getAreaSortingPipeline } from "../../../../helpers/generateSorting";
import PaymentBill from "../../models/paymentBills.model";


// [GET] /admin/properties
export const index = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      });
    }

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

    } else {

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
      permissions: {
        propertiesView: res.locals.currentUser.permissions.includes('properties_view'),
        propertiesEdit: res.locals.currentUser.permissions.includes('properties_edit'),
        propertiesCreate: res.locals.currentUser.permissions.includes('properties_create'),
        propertiesDelete: res.locals.currentUser.permissions.includes('properties_delete')
      }
    });

  } catch (error) {
    console.log('Error occurred while fetching properties data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [GET] /properties/pending
export const pending = async (req: Request, res: Response) => {
  try {
    const pendingProperties = await Property.find({
      deleted: false,
      status: 'pending'
    })
    
    res.status(200).json({
      code: 200,
      message: 'Success',
      pendingProperties: pendingProperties,
    });

  } catch (err) {
    console.log('Error occurred while fetching pending properties data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [GET] /admin/properties/detail/:propertyId
export const detail = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const id: string | undefined = req.params.propertyId;
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
    console.log('Error occurred while fetching properties data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [GET] /admin/properties/statistic
export const statistic = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    // Calculate x days ago from the current date
    const tenDaysAgo = subDays(startOfDay(new Date()), 10);

    const bills = await PaymentBill.find({
      deleted: false,
      createdAt: { $gte: tenDaysAgo }
    }).select('createdAt amount -_id');

    // re-format createdAt field from Date type to String type desired
    const dailySums = bills.reduce((acc, bill) => {
      const dateString = bill.createdAt.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
      const existingSum = acc.find((item) => item.createdAt === dateString);
    
      if (existingSum) {
        existingSum.amount += bill.amount;
      } else {
        acc.push({ createdAt: dateString, amount: bill.amount }); 
      }
    
      return acc;
    }, []); // initialize as an empty array for FE 
    
    if (bills) {
      res.status(200).json({
        code: 200,
        message: "Success",
        bills: dailySums
      })
    } else {
      res.status(400).json({
        code: 400,
        message: "No bill found"
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

// [DELETE] /admin/properties/delete/:propertyId
export const singleDelete = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_delete')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const id: string | undefined = req.params.propertyId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid property ID'
      });
    }

    const result = await Property.updateOne(
      { _id: id },
      { deleted: true }
    )

    if (result.matchedCount) {
      res.status(200).json({
        code: 200,
        message: "Property deleted successfully"
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "Property not found"
      });
    }

  } catch (error) {
    console.log('Error occurred while deleting property:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [POST] /admin/properties/create
export const createPost = async (req: any, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_create')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const property: PropertyType = processPropertyData(req);
    const processedImages = processImagesData(req.body.images);

    if (!property.position) {
      const cntProperty = await Property.countDocuments();
      property.position = cntProperty + 1;
    }

    const propertyWithImages = processedImages ? { ...property, images: processedImages } : property;
    const newProperty = new Property(propertyWithImages);
    await newProperty.save();
    
    res.status(200).json({
      code: 200,
      message: "Created new property successfully"
    })

  } catch (error) {
    console.log('Error occurred while creating property:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /admin/properties/edit/:propertyId
export const editPatch = async (req: Request, res: Response) => {
  try {  
    if (!res.locals.currentUser.permissions.includes('properties_edit')) {
      return res.status(403).json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const id: string | undefined = req.params.propertyId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid property ID'
      });
    }

    const propertyUpdated: PropertyType = processPropertyData(req);
    const processedImages = processImagesData(req.body.images);
    const imagesToRemove = processImagesData(req.body.images_remove);

    if (!propertyUpdated.position) {
      const cntProperty = await Property.countDocuments();
      propertyUpdated.position = cntProperty + 1;
    }

    await Property.findOneAndUpdate(
      { _id: id },
      { 
        $set: propertyUpdated,  // Update non-image fields
        $push: { images: { $each: processedImages }} // Push new images
      }
    );
    
    // Remove specified images
    await Property.findOneAndUpdate(
      { _id: id },
      { $pull: { images: { $in: imagesToRemove }}} // Remove specified images
    );

    res.status(200).json({
      code: 200,
      message: 'Property updated successfully'
    })

  } catch (error) {
    console.log('Error occurred while editing property:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /admin/properties/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (!res.locals.currentUser.permissions.includes('properties_edit')) {
    return res.json({
      code: 403,
      message: "Account does not have access rights"
    })
  }

  try {
    const status = req.params.status;

    if (!isValidStatus(status)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid status value',
      });
    }

    await Property.updateOne(
      { _id: req.params.propertyId.toString() }, 
      { 
        deleted: false,
        status: req.params.status
      }
    )

    res.status(200).json({
      code: 200,
      message: "Property status updated successfully"
    })

  } catch (error) {
    console.log('Error occurred while multing changing property:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
} 

// [PATCH] /admin/properties/multi-change
export const multiChange = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_edit')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const idsAndPos: string[] | undefined = req.body.ids;
    if (!idsAndPos) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid ID'
      });
    }
    
    const type: ValidMultiChangeType = req.body.type;  

    let idOnlyList: string[] = [];

    switch(type) {
      case 'active':
      case 'inactive':
        idOnlyList = idsAndPos.map(item => item.split('-')[0]);  

        await Property.updateMany(
          { _id: { $in: idOnlyList } }, 
          { status: type }
        )

        res.status(200).json({
          code: 200,
          message: 'Update multiple status successful!',
          idList: idOnlyList
        });
        break;

      case 'position':
        const updates = idsAndPos.map(item => {
          const [id, position] = item.split('-');

          return {
            updateOne: {
              filter: { _id: id },
              update: { position: position }
            }
          }
        });

        await Property.bulkWrite(updates as any);

        res.status(200).json({
          code: 200,
          message: "Properties position updated successfully" 
        })
        break;

      case 'delete':
        idOnlyList = idsAndPos.map(item => item.split('-')[0]);

        await Property.updateMany(
          { _id: { $in: idOnlyList }}, 
          {deleted: true }
        )

        res.status(200).json({
          code: 200,
          message: "Properties deleted successfully",
          idList: idOnlyList
        })
        break;

      default: 
        res.status(400).json({
          code: 400,
          message: 'Operation not found'
        })
        break;
    }


  } catch (error) {
    console.log('Error occurred while multing changing property:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
} 
