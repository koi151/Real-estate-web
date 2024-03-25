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
    const accountId: string | undefined = req.params.accountId;
    const deposit: boolean = req.body['deposit'];
    const amount: number = req.body['amount'];

    if (!accountId) return res.json({
      code: 400,
      message: 'Cannot get account id'
    })

    const updateResult = await ClientAccount.updateOne(
      { 
        _id: accountId,
        deleted: false 
      },
      { $inc: { 'wallet.balance': deposit ? amount : -amount } }
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
    console.log('Error occurred while fetching client accounts data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};