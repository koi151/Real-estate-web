import { Request, Response } from "express";

import Property from "../../models/property.model";

import { searchHelper } from "../../../../helpers/search";
import { paginationHelper } from '../../../../helpers/pagination';

// [GET] /admin/properties
export const index = async (req: Request, res: Response) => {
  try {
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
        limitItems: 2,
      },
      req.query,
      countRecords
    );
    
    const properties = await Property.find(find)
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

// [POST] /admin/properties/create
export const createPost = async (req: Request, res: Response) => {
  try {    
    const newProperty = new Property(req.body);
    await newProperty.save();
    
    res.json({
      code: 200,
      message: "Created new property succesfully !"
    })

  } catch (error) {
    console.log('Error occurred:', error);
    res.status(400).json({
      code: 400,
      message: "Error occurred"
    })
  }
}