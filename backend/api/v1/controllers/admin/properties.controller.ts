import { Request, Response } from "express";

import Property from "../../models/property.model";

import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from '../../../../helpers/pagination';
import { isValidStatus } from "../../../../helpers/dataTypeCheck";

import { PropertyType, ValidMultiChangeType } from "../../../../commonTypes";
import { processImagesData, processPropertyData } from "../../../../helpers/processData";


// [GET] /admin/properties
export const index = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    interface Find {
      deleted?: boolean | null,
      listingType?: string | null,
      price?: { $gte: number; $lte: number } | null;
      status?: string | null,
      'propertyDetails.propertyCategory'?: string | null;
      title?: RegExp | null,
      slug?: RegExp | null
    }
    
    let status: string | undefined = req.query.status?.toString();
    let category: string | undefined = req.query.category?.toString();
    const pageSize: number | null = req.query.pageSize ? parseInt(req.query.pageSize as string) : null;

    let listingType: string | undefined = req.query.listingType?.toString();
    let priceRange: number[] | undefined = (req.query.priceRange as string[])?.map(Number);
    
    const find: Find = {
      deleted: false,
      ...(status && { status }),
      ...(listingType && { listingType }),
      ...(category && { 'propertyDetails.propertyCategory': category }),
      ...(priceRange && { price: { $gte: priceRange[0], $lte: priceRange[1] } }),
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
        currentPage: typeof(req.query.currentPage) == "string" ? parseInt(req.query.currentPage) : 1,
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
    
    if (req.query.sortKey && req.query.sortValue) {
      sortingQuery[req.query.sortKey.toString()] = req.query.sortValue.toString() as 'asc' | 'desc';
    }

    const properties = await Property.find(find)
      .sort(sortingQuery || '')
      .limit(paginationObject.limitItems || 0)
      .skip(paginationObject.skip || 0);

    const propertyCount = await Property.countDocuments(find);

    if (properties.length > 0) {
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

    } else {
      res.json({
        code: 200,
        message: 'No properties found',
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
    }

  } catch (error) {
    console.log('Error occurred while fetching properties data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

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
    property['images'] = processedImages || property.images;    

    if (!property.position) {
      const cntProperty = await Property.countDocuments();
      property.position = cntProperty + 1;
    }

    const newProperty = new Property(property);
    await newProperty.save();
    
    res.json({
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
