import { Request, Response } from "express";

import AdminAccount from "../../models/adminAccount.model";
import Role from "../../models/roles.model";

import { AdminAccountType } from "../../../../commonTypes";
import { processAdminAccountData } from "../../../../helpers/processData";
import { isValidStatus } from "../../../../helpers/dataTypeCheck";

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const accounts = await AdminAccount.find(
      { deleted: false }
    ).select('-password -token');
    
    const accountPromises = accounts.map(async (account) => {
      console.log('acc check',account)
      const role = await Role.findOne(
        { 
          _id: account.role_id,
          deleted: false
        }
      ).select('title');
      return { ...account['_doc'], roleTitle: role ? role["title"] : 'unknown' };
    });
            
    const accountsWithRole = await Promise.all(accountPromises);
    
    if (accountsWithRole.length > 0) {
      res.status(200).json({
        code: 200,
        message: "Success",
        accounts: accountsWithRole,
        permissions: {
          administratorAccountsView: res.locals.currentUser.permissions.includes('administrator-accounts_view'),
          administratorAccountsEdit: res.locals.currentUser.permissions.includes('administrator-accounts_edit'),
          administratorAccountsCreate: res.locals.currentUser.permissions.includes('administrator-accounts_create'),
          administratorAccountsDelete: res.locals.currentUser.permissions.includes('administrator-accounts_delete')
        }
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

// [GET] /admin/accounts/detail/:accountId
export const detail = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const id: string | undefined = req.params.accountId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }

    const account = await AdminAccount.findOne(
      { _id: id, deleted: false }
    ).select('-password -token');

    if (!account) {
      return res.status(400).json({
        code: 400,
        message: "Account not found"
      });
    }

    const role = await Role.findOne({ 
        _id: account.role_id, 
        deleted: false 
      }).select('title');

    delete account.role_id;

    if (role) { 
      account['roleTitle'] = role.title;
    } else { 
      res.json({
        code: 200,
        message: "Can not get account role data",
        account: account,
      });
      return;
    }

    res.status(200).json({
      code: 200,
      message: "Success",
      account: account,
    });

  } catch (err) {
    console.log('Error occurred while fetching administrator accounts data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [GET] /admin/accounts/detail/local
export const localDetail = async (req: Request, res: Response) => {
  try {
    const user: any | undefined = res.locals.currentUser;

    if (!user) {
      return res.json({
        code: 404,
        message: "User information not found"
      })
    } 

    return res.status(200).json({
      code: 200,
      message: "Success",
      user: user
    })

  } catch (err) {
    console.log('Error occurred while fetching administrator account data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {   
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_create')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    if (req.body.email) {
      const userExisted = await AdminAccount.findOne({
        email: req.body.email,
      })

      if (userExisted) {
        return res.status(409).json({
          code: 409,
          message: "Email existed"
        })
      }

      const account: AdminAccountType = await processAdminAccountData(req); 

      const newAccount = new AdminAccount(account);
      await newAccount.save();
      
      return res.status(200).json({
        code: 200,
        message: "New administrator account created successfully"
      })
      
    } else {
      return res.status(400).json({
        code: 400,
        message: "Email is empty"
      })
    }

  } catch (error) {
    console.log('Error occurred while creating administrator account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_edit')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const id: string | undefined = req.params.accountId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }
    
    const status = req.params.status;
    if (!isValidStatus(status)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid status value',
      });
    }

    await AdminAccount.updateOne(
      { _id: String(id) }, 
      { 
        deleted: false,
        status: req.params.status
      }
    )

    res.status(200).json({
      code: 200,
      message: "Admin account status updated successfully"
    })

  } catch (error) {
    console.log('Error occurred while updating admin account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
} 

// [PATCH] /admin/accounts/edit/:accountId
export const editPatch = async (req: Request, res: Response) => {
  try {    
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_edit')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const id: string | undefined = req.params.accountId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }
    const accountUpdates: AdminAccountType = await processAdminAccountData(req);
    const avatar = req.body.images;

    const result = await AdminAccount.updateOne(
      { _id: id },
      { 
        $set: { ...accountUpdates, avatar: avatar }, 
      }
    );

    if (result.matchedCount) {
      res.status(200).json({
        code: 200,
        message: "Account has been updated successfully"
      })
    } else {
      return res.status(400).json({
        code: 400,
        message: 'Error occurred, could not found account'
      });
    }

  } catch (err) {
    console.log('Error occurred while updating administrator account:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [DELETE] /admin/accounts/delete/:accountID
export const singleDelete = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_delete')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }
  
    const id: string | undefined = req.params.accountId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }

    const result = await AdminAccount.updateOne(
      { _id: id },
      { deleted: true }
    )

    if (result.matchedCount) {
      res.status(200).json({
        code: 200,
        message: "Account deleted successfully"
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "Account not found"
      });
    }

  } catch (error) {
    console.log('Error occurred while deleting role:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}