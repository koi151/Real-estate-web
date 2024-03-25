import { Request, Response } from "express";
import AdminAccount from "../../models/adminAccount.model";
import Property from "../../models/property.model";
import Category from "../../models/propertyCategories.model";
import ClientAccount from "../../models/clientAccount.model";

interface Count {
  total: number;
  active: number;
  inactive: number;
}

interface Statistics {
  adminAccounts: Count;
  clientAccounts: Count;
  properties: Count;
  categories: Count;
}

const countDocuments = async (model: any): Promise<Count> => {
  const total = await model.countDocuments({ deleted: false });
  const active = await model.countDocuments({ status: 'active', deleted: false });
  const inactive = await model.countDocuments({ status: 'inactive', deleted: false });
  return { total, active, inactive };
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const [adminAccounts, clientAccounts, properties, categories] = await Promise.all([
      countDocuments(AdminAccount),
      countDocuments(ClientAccount),
      countDocuments(Property),
      countDocuments(Category)
    ]);

    const statistics: Statistics = { adminAccounts, clientAccounts, properties, categories };

    return res.status(200).json({ 
      code: 200, 
      message: 'Success', 
      statistics 
    });

  } catch (err) {
    console.log('Error occurred while fetching data for dashboard:', err);
    return res.status(500).json({ 
      code: 500, 
      message: 'Internal Server Error' 
    });
  }
}
