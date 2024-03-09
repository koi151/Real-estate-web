import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import AdminAccount from "../../models/adminAccount.model";
import { processAccountLogData } from "../../../../helpers/processData";
import { AccountLogType, AdminAccountType } from "../../../../commonTypes";
import { generateRandomString } from "../../../../helpers/generateString";
import { decodeToken, generateToken } from "../../../../helpers/auth.methods";
import Role from "../../models/roles.model";

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const userInfo: AccountLogType = await processAccountLogData(req);

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
  
    let refreshToken = generateRandomString(30);

    if (!user.token) {
      await AdminAccount.updateOne({
        _id: user._id,
        refreshToken: refreshToken
      })
    } else {
      refreshToken = user.token;
    }

    const userPermissions = await Role.findOne({
      _id: user.role_id,
      deleted: false
    }).select('permissions')

    if (userPermissions) {

      // convert document to JSON
      const regularUserObj = { ...user['_doc'] };

      delete regularUserObj['password'];
      delete regularUserObj["accessToken"];
      delete regularUserObj["refreshToken"];
      delete regularUserObj["token"];    

      regularUserObj['permissions'] = userPermissions.permissions;

      res.status(200).json({
        code: 200,
        message: 'Success',
        accessToken,
        refreshToken,
        user: regularUserObj
      });

    } else {
      res.json({
        code: 400,
        message: 'Can not get permissions of account',
      });
    }

  } catch (error) {
    console.log('Error occurred while verifying account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {

	// Get access token from header
	const accessTokenFromHeader = req.headers.authorization;

	if (!accessTokenFromHeader) {
		return res.status(400).json({
      code: 400,
      message: 'Access token not found'
    });
	}

	// Get refresh token from body
	const refreshTokenFromBody = req.body.refreshToken;

	if (!refreshTokenFromBody) {
		return res.status(400).json({
      code: 400,
      message: 'Refresh token not found'
    });
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET 
  // || jwtVariable.accessTokenSecret;

	const accessTokenLife = process.env.ACCESS_TOKEN_LIFE 
    // || jwtVariable.accessTokenLife;

	// Decode access token
	const decoded = await decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);

	if (!decoded) {
		return res.status(400).json({
      code: 400,
      message:'Access token not valid.'
    });
	}
  console.log('decoded["payload"]', decoded["payload"])

	const id = decoded['payload']._id; // Get username from payload

	const user = await AdminAccount.findOne({
    _id: id
  });
	if (!user) {
		return res.status(401).send('User not exists.');
	}

	if (refreshTokenFromBody !== user['refreshToken']) {
		return res.status(400).send('Refresh token not legit.');
	}

	// Create new access token
	const dataForAccessToken = {
		id,
	};

	const accessToken = await generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(400)
			.send('Access token create failed, please try again.');
	}
	return res.json({
		accessToken,
	});
}; // !
