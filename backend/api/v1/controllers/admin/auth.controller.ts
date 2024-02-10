import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import AdminAccount from "../../models/adminAccount.model";
import { processAdminAccountLogData } from "../../../../helpers/processData";
import { AdminAccountLogType, AdminAccountType } from "../../../../commonTypes";
import { generateRandomString } from "../../../../helpers/generateString";
import { generateToken } from "../../../../helpers/auth.methods";

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const userInfo: AdminAccountLogType = await processAdminAccountLogData(req);

    const user: AdminAccountType = await AdminAccount.findOne({ 
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

    const passwordMatch = bcrypt.compareSync(userInfo.password, user.password);

    if (!passwordMatch) {
      return res.json({
        code: 401,
        message: "Incorrect email or password"
      });
    }

    if (user.status === 'inactive') {
      return res.json({
        code: 403,
        message: "Account has been blocked"
      });
    }

    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const dataForAccessToken = {
      username: user._id
    };

    const accessToken = await generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife,
    );

    if (!accessToken) {
      return res.status(401).json({
        message: "Login failed, please try again."
      });
    }
  
    // let refreshToken = generateRandomString(jwtVariable.refreshTokenSize);
    let refreshToken = generateRandomString(30);

    if (!user.token) {
      await AdminAccount.updateOne({
        _id: user._id,
        refreshToken: refreshToken
      })
    } else {
      refreshToken = user.token;
    }

    console.log("accessToken:", accessToken)
    console.log("refreshToken:", refreshToken)
    console.log("user:", user)


    res.status(200).json({
      code: 200,
      message: 'Success',
      accessToken,
      refreshToken,
      user,
    });

  } catch (error) {
    console.log('Error occurred while verifying account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};