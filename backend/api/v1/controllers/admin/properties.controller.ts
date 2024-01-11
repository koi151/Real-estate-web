import { Request, Response } from "express";

import Property from "../../models/property.model";

import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from '../../../../helpers/pagination';

// [GET] /admin/properties
export const index = async (req: Request, res: Response) => {
  try {
    console.log("req.url:", req.url)
    console.log("req.query:", req.query)
    console.log("req.params:", req.params)

    interface Find {
      deleted: boolean,
      status?: string,
      title?: RegExp
    }

    const find: Find = {
      deleted: false,
    };

    // Searching
    const searchObject = searchHelper(req.query);
    if (searchObject.regex) {
      find.title = searchObject.regex;
    }

    // Pagination
    const countRecords = await Property.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItems: 4,
      },
      req.query,
      countRecords
    );

    // Sort
    const sort: { [key: string]: any } = {};

    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      sort[sortKey] = req.query.sortValue;
    }
    
    const properties = await Property.find(find)
      .sort(sort || '')
      .limit(objectPagination.limitItems || 0)
      .skip(objectPagination.skip || 0);


    if (properties.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        properties: properties
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'No properties found'
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

// [GET] /admin/properties
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

interface PropertyData {
  title: string;
  price: number;
  status: string;
  listingType?: string;
  description?: string;
  area?: {
    length: number;
    width: number;
  };
  images?: string[];
  location?: {
    city: string;
    district: string;
  };
  propertyDetails?: {
    type: string;
    subType: string;
    features: string[];
  };
  deleted?: Boolean;
}

// [POST] /admin/properties/create
export const createPost = async (req: Request, res: Response) => {
  try {    
    const property: PropertyData = {
      title: req.body.title,
      listingType: req.body.listingType,
      description: req.body.description,
      price: req.body.price,
      area: req.body.area,
      images: req.body.images,
      status: req.body.status,
      location: req.body.location,
      propertyDetails: req.body.propertyDetails,
      deleted: req.body.deleted
    };

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
    const id: string = req.params.propertyId
    const property: PropertyData = {
      title: req.body.title,
      listingType: req.body.listingType,
      description: req.body.description,
      price: req.body.price,
      area: req.body.area,
      images: req.body.images,
      status: req.body.status,
      location: req.body.location,
      propertyDetails: req.body.propertyDetails,
      deleted: req.body.deleted
    };

    await Property.updateOne(
      { _id: id },
      property
    )

    res.status(200).json({
      code: 200,
      message: 'Edited property successful'
    })

  } catch (error) {
    console.log('Error occurred while editing property:', error);
    res.status(400).json({
      code: 400,
      message: "Error occurred while editing property"
    })
  }
}