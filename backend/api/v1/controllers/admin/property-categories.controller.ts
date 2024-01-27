import { Request, Response } from "express"

import PropertyCategory from "../../models/propertyCategories.model";
import { isValidStatus } from "../../../../helpers/dataTypeCheck";
import { PropertyCategoryType } from "../../../../commonTypes";

const processCategoryData = (req: Request): PropertyCategoryType => {
  return {
    title: req.body.title || '',
    status: req.body.status || '',
    position: parseFloat(req.body.position),
    description: req.body.description || '',
    slug: req.body.slug || '',
    parent_id: req.body.parent_id || '',
    deleted: Boolean(req.body.deleted),
  };
}

const processImagesData = (imageUrls: string[] | string | undefined): string[] => {
  return imageUrls ? (Array.isArray(imageUrls) ? imageUrls : [imageUrls]) : [];
};


// [GET] /admin/property-categories
export const index = async (req: Request, res: Response) => {
  try {
    const categories = await PropertyCategory.find()

    if (categories.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        categories: categories
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'No categories found',
      });
    }

  } catch (error) {
    console.log("Error occurred:", error);
    res.status(400).json({
      code: 400,
      message: "Error occurred while fetching property categories data"
    })
  }
}

// [PATCH] /admin/property-categories/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status = req.params.status;

    if (!isValidStatus(status)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid status value',
      });
    }

    await PropertyCategory.updateOne(
      { _id: req.params.propertyId.toString() }, 
      { 
        deleted: false,
        status: req.params.status
      }
    )

    res.status(200).json({
      code: 200,
      message: "Property category status updated successfully"
    })

  } catch (error) {
    console.log('Error occurred while multing changing property:', error);
    res.status(400).json({
      code: 400,
      message: "Error occurred while multing changing property"
    })
  }
} 

// [PATCH] /admin/property-categories/edit/:propertyId
export const editPatch = async (req: Request, res: Response) => {
  try {    
    console.log("req.body:", req.body)
    const id: string = req.params.categoryId;
    const propertyUpdated: PropertyCategoryType = processCategoryData(req);

    const images = await processImagesData(req.body.images);
    const imagesToRemove = await processImagesData(req.body.images_remove)
    
    await PropertyCategory.findOneAndUpdate(
      { _id: id },
      { 
        $set: propertyUpdated,  // Update non-image fields
        $push: { images: { $each: images }} // Push new images
      }
    );
    
    // Remove specified images // push && pull together causes CONFLICT 
    await PropertyCategory.findOneAndUpdate(
      { _id: id },
      { $pull: { images: { $in: imagesToRemove }}} // Remove specified images
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

// [GET] /admin/property-categories/detail/:categoryId
export const detail = async (req: Request, res: Response) => {
  try {
    const id : string = req.params.categoryId;
    const category = await PropertyCategory.findOne(
      { _id: id }, 
      { deleted: false }
    )

    if (category) {
      res.status(200).json({
        code: 200,
        message: "Success",
        category: category
      })
    } else {
      res.status(400).json({
        code: 400,
        message: "Property category not found"
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