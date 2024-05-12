import { Request, Response } from "express";

import ClientAccount from "../../models/clientAccount.model";
import { ClientAccountType } from "../../../../commonTypes";
import { processClientAccountData } from "../../../../helpers/processData";
import { isValidStatus } from "../../../../helpers/dataTypeCheck";


// [GET] /admin/client-accounts
export const index = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const accounts = await ClientAccount.find(
      { deleted: false }
    ).select('-password -token');
    
    if (accounts.length > 0) {
      res.status(200).json({
        code: 200,
        message: "Success",
        accounts: accounts,
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

// [GET] /admin/client-accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_view')) {
      return res.status(403).json({
        code: 403,
        message: "Account does not have access rights"
      });
    }
    
    console.log('client detail params:', req.params)
    const id: string | undefined = req.params.id;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }
    
    const account = await ClientAccount.findOne(
        { _id: id, deleted: false }
      ).select('-password -token');

    if (!account) {
      return res.status(404).json({
        code: 404,
        message: "Account not found"
      });
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

// [GET] /admin/client-accounts/detail/local
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
    console.log('Error occurred while fetching client account data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [POST] /admin/client-accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {   
    if (!res.locals.currentUser.permissions.includes('administrator-accounts_create')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    if (req.body.email) {
      const userExisted = await ClientAccount.findOne({
        email: req.body.email,
      })

      if (userExisted) {
        return res.status(409).json({
          code: 409,
          message: "Email existed"
        })
      }

      const account: ClientAccountType = await processClientAccountData(req); 

      const newAccount = new ClientAccount(account);
      await newAccount.save();
      
      return res.status(200).json({
        code: 200,
        message: "New client account created successfully"
      })
      
    } else {
      return res.status(400).json({
        code: 400,
        message: "Email is empty"
      })
    }

  } catch (error) {
    console.log('Error occurred while creating client account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /admin/client-accounts/change-status/:status/:accountId
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

    await ClientAccount.updateOne(
      { _id: String(id) }, 
      { 
        deleted: false,
        status: req.params.status
      }
    )

    res.status(200).json({
      code: 200,
      message: "Client account status updated successfully"
    })

  } catch (error) {
    console.log('Error occurred while updating client account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
} 

// [PATCH] /admin/client-accounts/edit/:accountId
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
    const accountUpdates: ClientAccountType = await processClientAccountData(req);
    const avatar = req.body.images;

    const result = await ClientAccount.updateOne(
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
    console.log('Error occurred while updating client account:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [DELETE] /admin/client-accounts/delete/:accountId
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

    const result = await ClientAccount.updateOne(
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
    console.log('Error occurred while deleting account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}