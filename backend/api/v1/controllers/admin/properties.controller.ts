import { Request, Response } from "express";

import Property from "../../models/property.model";

import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from '../../../../helpers/pagination';
import { isValidStatus } from "../../../../helpers/dataTypeCheck";

import { PropertyType, ValidMultiChangeType } from "../../../../commonTypes";

const processPropertyData = (req: Request): PropertyType => {
  const images = Array.isArray(req.body.images) ? req.body.images.map(String) : [String(req.body.images)];

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
    images: images,
    location: req.body.location || '',
    slug: req.body.slug || '',
    listingType: req.body.listingType || '',
    propertyDetails: req.body.propertyDetails || '',
    deleted: Boolean(req.body.deleted),
  };
};

// [GET] /admin/properties
export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean,
      status?: string,
      title?: RegExp,
      slug?: RegExp
    }
    
    let status: string | undefined = req.query.status?.toString();

    const find: Find = {
      deleted: false,
      ...(status && { status }),
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
    res.status(400).json({
      code: 400,
      message: "Error occurred while fetching properties data"
    })
  }
}

// [GET] /admin/properties/detail/:propertyId
export const detail = async (req: Request, res: Response) => {
  try {
    const id : string = req.params.propertyId;
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
    res.status(400).json({
      code: 400,
      message: "Error occurred while fetching properties data"
    })
  }
}

// [GET] /admin/properties/delete/:propertyId
export const singleDelete = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.propertyId;

    await Property.updateOne(
      { _id: id },
      { deleted: true }
    )

    res.status(200).json({
      code: 200,
      message: "Property deleted successfully"
    })

  } catch (error) {
    console.log('Error occurred while deleting property:', error);
    res.status(400).json({
      code: 400,
      message: "Error occurred while deleting property"
    })
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
    res.status(400).json({
      code: 400,
      message: "Error occurred while creating property"
    })
  }
}

// [PATCH] /admin/properties/edit/:propertyId
export const editPatch = async (req: Request, res: Response) => {
  try {    
    const id: string = req.params.propertyId;
    const propertyUpdated: PropertyType = processPropertyData(req);

    await Property.findOneAndUpdate(
      { _id: id },
      {
        $push: { images: { $each: propertyUpdated.images } },
      }
    );

    res.status(200).json({
      code: 200,
      message: 'Property updated successfully'
    })

  } catch (error) {
    console.log('Error occurred while editing property:', error);
    res.status(400).json({
      code: 400,
      message: "Error occurred while editing property"
    })
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
    res.status(400).json({
      code: 400,
      message: "Error occurred while multing changing property"
    })
  }
} 

// [PATCH] /admin/properties/multi-change
export const multiChange = async (req: Request, res: Response) => {
  try {

    const idsAndPos: string[] = req.body.ids;
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
    res.status(400).json({
      code: 400,
      message: "Error occurred while multing changing property"
    })
  }
} 
