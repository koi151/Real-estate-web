import { Request, Response } from "express";

import AdminAccount from "../../models/adminAccount.model";
import Property from "../../models/property.model";
import Category from "../../models/propertyCategories.model";
import ClientAccount from "../../models/clientAccount.model";
import PaymentBill from "../../models/paymentBills.model";
import { aggregateDailySums, calculateTimeBefore, parseTimeUnit } from "../../../../helpers/statistics";


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

// [GET] /admin/dashboard/statistic
export const revenue = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('properties_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      });
    }

    // Parse and validate time range and unit
    const { timeRangeStr, unit } = parseTimeUnit(req.query.timeRange.toString());
    const timeRange = parseInt(timeRangeStr);

    if (!unit || !timeRange || !['days', 'months', 'years'].includes(unit)) {
      return res.json({
        code: 400,
        message: "Data type requested were not legit"
      });
    }

    // Calculate time before based on unit
    const timeBefore = calculateTimeBefore(unit, timeRange);

    // Handle statistic types: revenue and posts
    let dataSatisfied: any[];
    if (req.query.type.toString() === 'revenue') {
      dataSatisfied = await PaymentBill.find({
        deleted: false,
        createdAt: { $gte: timeBefore }
      })
        .select('createdAt amount -_id')
        .sort({ createdAt: 1 });

      // Aggregate daily sums efficiently
      const dailySums = aggregateDailySums(dataSatisfied, unit);

      console.group("dailySums:", dailySums)

      res.status(200).json({
        code: 200,
        message: "Success",
        data: dailySums
      });
      
    } else if (req.query.type.toString() === 'posts') {
      dataSatisfied = await Property.aggregate([
        {
          $match: {
            deleted: false,
            createdAt: { $gte: calculateTimeBefore(unit, timeRange) }
          }
        },
        {
          $project: {
            // Create a new field with formatted date based on unit
            dateString: {
              $dateToString: { format: unit === 'days' ? '%m/%d' : (unit === 'months' ? '%m/%Y' : '%Y'), date: '$createdAt' }
            }
          }
        },
        {
          $group: {
            _id: '$dateString', // Group by formatted date
            count: { $sum: 1 }  // Count documents in each group
          }
        },
        {
          $sort: { _id: 1 } // asc sort
        },
        {
          $project: {
            createdAt: '$_id' , 
            count: '$count',
            _id: 0 // Remove "_id" field
          }
        }
      ]);

      res.status(200).json({
        code: 200,
        message: "Success",
        data: dataSatisfied
      });
    } else {
      return res.json({
        code: 400,
        message: 'Invalid statistic type'
      });
    }
  } catch (error) {
    console.log('Error occurred while fetching revenue data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};
