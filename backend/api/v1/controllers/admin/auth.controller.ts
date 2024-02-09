import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import AdminAccount from "../../models/adminAccount.model";
import { processAdminAccountLogData } from "../../../../helpers/processData";
import { AdminAccountLogType } from "../../../../commonTypes";

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    console.log('login')

    const userInfo: AdminAccountLogType = await processAdminAccountLogData(req);

    const user = await AdminAccount.findOne({ 
      email: userInfo.email,
      deleted: false
    });

    if (!user) {
      res.status(401).json({
        code: 401,
        message: "Incorrect email or password"
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(userInfo.password, user.password);

    if (!passwordMatch) {
      res.json({
        code: 401,
        message: "Incorrect email or password"
      });
      return;
    }

    if (user.status === 'inactive') {
      res.json({
        code: 403,
        message: "Account has been blocked"
      });
      return;
    }

    res.cookie("token", user.token);
    res.status(200).json({
      code: 200,
      message: "Success"
    });

  } catch (error) {
    console.log('Error occurred while verifying account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};