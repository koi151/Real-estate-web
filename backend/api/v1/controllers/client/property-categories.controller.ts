import { Request, Response } from "express"

import PropertyCategory from "../../models/propertyCategories.model";
import { PropertyCategoryType, TreeNode } from "../../../../commonTypes";
import { Document } from "mongoose";
import { createTreeHelper } from "../../../../helpers/createTree";

// [GET] /property-category/category-tree
export const categoryTree = async (req: Request, res: Response) => {
  try {
    const categories: Document<PropertyCategoryType>[] = await PropertyCategory.find(
      { deleted: false },
      'id title parent_id'
    );

    // convert to TreeNode type:
    const categoryTree: TreeNode[] = createTreeHelper(categories.map(doc => doc.toObject()));
    
    if (categoryTree) {
      res.status(200).json({
        code: 200,
        message: 'Get category tree successfully',
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