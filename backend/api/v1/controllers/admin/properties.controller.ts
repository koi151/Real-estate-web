import { Request, Response } from "express";

import Property from "../../models/property.model";

import { searchHelper } from "../../../../helpers/search";
import { createTreeHelper } from "../../../../helpers/createTree";
import { paginationHelper } from '../../../../helpers/pagination';
import { isValidStatus } from "../../../../helpers/dataTypeCheck";

import { PropertyType, ValidMultiChangeType } from "../../../../commonTypes";

const processPropertyData = (req: Request): PropertyType => {

  return {
    title: req.body.title || '',
    status: req.body.status || '',
    postType: req.body.postType || '',
    position: parseFloat(req.body.position),
    description: req.body.description || '',
    area: {
      propertyWidth: parseFloat(req.body.area?.propertyWidth),
      propertyLength: parseFloat(req.body.area?.propertyLength),
    },
    price: parseFloat(req.body.price),
    location: req.body.location || '',
    slug: req.body.slug || '',
    listingType: req.body.listingType || '',
    propertyDetails: req.body.propertyDetails || '',
    deleted: Boolean(req.body.deleted),
  };
};

const processImagesData = (imageUrls: string[] | string | undefined): string[] => {
  return imageUrls ? (Array.isArray(imageUrls) ? imageUrls : [imageUrls]) : [];
};

// [GET] /admin/properties
export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted?: boolean | null,
      listingType?: string | null
      status?: string | null,
      title?: RegExp | null,
      slug?: RegExp | null
    }
    
    let status: string | undefined = req.query.status?.toString();
    let listingType: string | undefined = req.query.listingType?.toString();

    const find: Find = {
      deleted: false,
      ...(status && { status }),
      ...(listingType && { listingType }),
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
        limitItems: 3,
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
        propertyCount: propertyCount
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'No properties found',
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
    const property: PropertyType = processPropertyData(req);

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
    const id: string | undefined = req.params.propertyId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid property ID'
      });
    }

    const propertyUpdated: PropertyType = processPropertyData(req);

    const images = processImagesData(req.body.images);
    const imagesToRemove = processImagesData(req.body.images_remove);

    await Property.findOneAndUpdate(
      { _id: id },
      { 
        $set: propertyUpdated,  // Update non-image fields
        $push: { images: { $each: images }} // Push new images
      }
    );
    
    // Remove specified images // push && pull together causes CONFLICT 
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
