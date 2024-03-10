import { Request, Response } from "express";

import ClientAccount from "../../models/clientAccount.model";

// [GET] /accounts/avatar/:accountId
export const getAvatar = async (req: Request, res: Response) => {
  try {
    const id: string | undefined = req.params.accountId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid account ID'
      });
    }

    const currentUser = await ClientAccount.findOne(
      { _id: id, deleted: false }
    ).select('avatar -_id');

    if (!currentUser) {
      return res.status(400).json({
        code: 400,
        message: "Avatar not found"
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success",
      currentUser: currentUser,
    });

  } catch (err) {
    console.log('Error occurred while fetching client account data:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

// [GET] /accounts/detail/local
export const localDetail = async (req: Request, res: Response) => {
  try {
    const user: any = res.locals.currentClientUser;

    console.log('user-ctrl-cl', user)

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
