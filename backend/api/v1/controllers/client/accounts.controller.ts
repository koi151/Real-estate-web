import { Request, Response } from "express";
import ClientAccount from "../../models/clientAccount.model";
import AdminAccount from "../../models/adminAccount.model";
import Role from "../../models/roles.model";

// [GET] /accounts/detail/local
export const localDetail = async (req: Request, res: Response) => {
  try {
    const user: any | undefined = res.locals.currentUserClient;

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

// [GET] /accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string | undefined = req.params.id;

    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }

    const accountType: string = req.params.accountType;
    if (!accountType) {
      return res.status(400).json({
        code: 400,
        message: 'No account type requested'
      });
    }

    let account: any;
    
    if (accountType === 'admin') {
      account = await AdminAccount.findOne(
        { _id: id, deleted: false }
      ).select('-password -token');

    } else {
      account = await ClientAccount.findOne(
        { _id: id, deleted: false }
      ).select('-password -token');
    }

    if (!account) {
      return res.status(404).json({
        code: 404,
        message: "Account not found"
      });
    }

    if (accountType === 'admin') {
      const role = await Role.findOne({ _id: account.role_id, deleted: false }).select('title');
      if (role) {
        account.roleTitle = role.title;
      } else {
        return res.status(404).json({
          code: 404,
          message: "Account role not found"
        });
      }
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

// [PATCH] /accounts/favorite-posts/:accountId
export const favorites = async (req: Request, res: Response) => {
  try {
    const accountId: string | undefined = req.params.accountId;
    if (!accountId) return res.json({
      code: 400,
      message: 'Cannot get account id'
    })

    const postId: string | undefined = req.body['postId'];
    if (!postId) return res.json({
      code: 400,
      message: 'Cannot get post id'
    })

    const clientAccount = await ClientAccount.findOne({ _id: accountId });
    if (!clientAccount) {
      return res.json({
        code: 404,
        message: 'Account not found'
      });
    }

    const isPostFavorited = clientAccount.favoritePosts.includes(postId);
    let isAddTask: boolean = false;

    if (isPostFavorited) {
      await ClientAccount.updateOne(
          { _id: accountId },
          { $pull: { favoritePosts: postId } }
      );

    } else {
      isAddTask = true;
      await ClientAccount.updateOne(
          { _id: accountId },
          { $addToSet: { favoritePosts: postId } }
      );
    }

    res.status(200).json({
      code: 200,
      message: 'Success',
      isAddTask: isAddTask
    })

  } catch (err) {
    console.log('Error occurred while fetching administrator accounts data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [PATCH] /accounts/update-balance 
export const patchBalance = async (req: Request, res: Response) => {
  try {
    console.log("req.body patchBalance:", req.body);

    const accountId: string | undefined = req.params.accountId;
    const deposit: boolean = req.body['deposit'];
    const amount: number = req.body['amount'];

    console.log("accountId:", accountId)

    if (!accountId) return res.json({
      code: 400,
      message: 'Cannot get account id'
    })

    // const updateOperator = {
    //   $inc: {
    //     balance: deposit ? amount : -amount // Use ternary operator for concise update
    //   }
    // };

    // const updateResult = await collection.updateOne(
    //   { _id: clientId },
    //   updateOperator
    // );

    const updateResult = await ClientAccount.updateOne(
      { 
        _id: accountId,
        deleted: false 
      },
      { $inc: { balance: deposit ? amount : -amount } }
    );

    if (updateResult.modifiedCount === 1) {
      res.status(200).json({
        code: 200,
        message: 'Account balance updated successfully'
      })

    } else {
      res.json({
        code: 400,
        message: 'Cannot find client account'
      })
    }

  } catch (err) {
    console.log('Error occurred while fetching administrator accounts data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};