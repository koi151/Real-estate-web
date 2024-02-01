import { Request, Response } from "express"

import PropertyCategory from "../../models/propertyCategories.model";
import { isValidStatus } from "../../../../helpers/dataTypeCheck";
import { PropertyCategoryType, TreeNode } from "../../../../commonTypes";
import { searchHelper } from "../../../../helpers/search";
import Category from "../../models/propertyCategories.model";
import { paginationHelper } from "../../../../helpers/pagination";
import { Document } from "mongoose";
import { createTreeHelper } from "../../../../helpers/createTree";

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
// export const index = async (req: Request, res: Response) => {
//   try {
//     const categories = await PropertyCategory.find({
//       deleted: false
//     })

//     if (categories.length > 0) {
//       res.status(200).json({
//         code: 200,
//         message: 'Success',
//         categories: categories
//       });
//     } else {
//       res.status(404).json({
//         code: 404,
//         message: 'No categories found',
//       });
//     }

//   } catch (error) {
//     console.log("Error occurred:", error);
//     return res.status(500).json({
//       code: 500,
//       message: 'Internal Server Error'
//     });
//   }
// }

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
    const countRecords = await Category.countDocuments(find);
    let paginationObject = paginationHelper(
      {
        currentPage: typeof(req.query.currentPage) == "string" ? parseInt(req.query.currentPage) : 1,
        limitItems: 2,
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

    const categories = await Category.find(find)
      .sort(sortingQuery || '')
      .limit(paginationObject.limitItems || 0)
      .skip(paginationObject.skip || 0);

    const categoryCount = await Category.countDocuments(find);

    if (categories.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        categories: categories,
        paginationObject: paginationObject,
        categoryCount: categoryCount
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'No category found',
      });
    }

  } catch (error) {
    console.log('Error occurred while fetching categories data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [GET] /admin/property-categories/detail/:categoryId
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string | undefined = req.params.categoryId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid category ID'
      });
    }
  
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
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [GET] /admin/property-category/category-tree
export const categoryTree = async (req: Request, res: Response) => {
  try {
    const categories: Document<PropertyCategoryType>[] = await PropertyCategory.find(
      { deleted: false },
      'id title parent_id'
    );

    //convert to TreeNode type:
    const categoryTree: TreeNode[] = createTreeHelper(categories.map(doc => doc.toObject()));
    
    if (categoryTree) {
      res.status(200).json({
        code: 200,
        message: 'Get existed categories successfully',
        categoryTree: categoryTree,
      });
    } else {
      res.status(404).json({
        code: 404,
        message: 'Create category tree failed',
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
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
} 

// [PATCH] /admin/property-categories/edit/:propertyId
export const editPatch = async (req: Request, res: Response) => {
  try { 
    const id: string | undefined = req.params.categoryId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid category ID'
      });
    }
    const categoryUpdated: PropertyCategoryType = processCategoryData(req);

    const images = processImagesData(req.body.images);
    const imagesToRemove = processImagesData(req.body.images_remove)
    
    await PropertyCategory.findOneAndUpdate(
      { _id: id },
      { 
        $set: categoryUpdated,  // Update non-image fields
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
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [POST] /admin/property-categories/create
export const createPost = async (req: Request, res: Response) => {
  try {    
    const category: PropertyCategoryType = processCategoryData(req);

    if (!category.position) {
      const cntCategory = await Category.countDocuments();
      category.position = cntCategory + 1;
    }

    const newCategory = new Category(category);
    await newCategory.save();
    
    res.json({
      code: 200,
      message: "Created new property category successfully"
    })

  } catch (error) {
    console.log('Error occurred while creating property category:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [DELETE] /admin/property-categories/delete/:propertyId
export const singleDelete = async (req: Request, res: Response) => {
  try {
    const id: string | undefined = req.params.categoryId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid category ID'
      });
    }

    const result = await PropertyCategory.updateOne(
      { _id: id },
      { deleted: true }
    )

    if (result.matchedCount) {
      res.status(200).json({
        code: 200,
        message: "Property category deleted successfully"
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "Property category not found"
      });
    }

  } catch (error) {
    console.log('Error occurred while deleting category:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}