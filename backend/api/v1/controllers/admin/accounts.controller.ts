import { Request, Response } from "express";

import Accounts from "../../models/adminAccount.model";
import Role from "../../models/roles.model";
import { AdminAccountType } from "../../../../commonTypes";

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    const accounts = await Accounts.find(
      { deleted: false }
    ).select('fullName email phone avatar role_id status createdAt');
    
    const accountPromises = accounts.map(async (account) => {
      const role = await Role.findOne(
        { 
          _id: account.role_id,
          deleted: false
        }
      ).select('title');
      return { ...account['_doc'], roleTitle: role ? role["title"] : 'unknown' };
    });
            
    const accountsWithRole = await Promise.all(accountPromises);
    console.log(accountsWithRole)
    
    if (accountsWithRole.length > 0) {
      res.status(200).json({
        code: 200,
        message: "Success",
        accounts: accountsWithRole
      })

    } else {
      res.status(400).json({
        code: 400,
        message: "Could not found any account"
      })
    }

  } catch (err) {
    console.log("Error occurred:", err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}