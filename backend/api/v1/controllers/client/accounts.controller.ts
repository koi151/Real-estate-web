import { Request, Response } from "express";

// [GET] /accounts/detail/local
export const localDetail = async (req: Request, res: Response) => {
  try {
    console.log('run localDetail - client', res.locals);
    const user: any = res.locals.currentClientUser;

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
