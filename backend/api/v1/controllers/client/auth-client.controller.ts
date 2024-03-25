import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import ClientAccount from "../../models/clientAccount.model";
import { processAccountLoginData } from "../../../../helpers/processData";
import { AccountLoginType, ClientAccountType } from "../../../../commonTypes";
import { decodeToken, generateToken } from "../../../../helpers/auth.methods";

// [POST] /auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const userInfo: AccountLoginType = await processAccountLoginData(req);

    const user: ClientAccountType = await ClientAccount.findOne({ 
      email: userInfo.email,
      deleted: false
    });

    if (!user || !bcrypt.compareSync(userInfo.password, user.password)) {
      return res.status(401).json({
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

    const clientAccessToken = await generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife,
    );

    if (!clientAccessToken) {
      return res.status(401).json({
        message: "Login failed, please try again."
      });
    }
  
    // let refreshToken = generateRandomString(30);

    // if (!user.token) {
    //   await ClientAccount.updateOne({
    //     _id: user._id,
    //     refreshToken: refreshToken
    //   })
    // } else {
    //   refreshToken = user.token;
    // }

    delete user.token;
    delete user.password;

    res.cookie('clientAccessToken', clientAccessToken, {
      expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict',
      path: '/' 
    })

    return res.status(200).json({
      code: 200,
      message: 'Success',
      user: user
    });

  } catch (error) {
    console.log('Error occurred while verifying account:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
};


export const clientRefreshToken = async (req: Request, res: Response) => {

	// Get access token from header
	const accessTokenFromHeader = req.headers.authorization;

	if (!accessTokenFromHeader) {
		return res.status(400).json({
      code: 400,
      message: 'Access token not found'
    });
	}

	// Get refresh token from body
	const clientRefreshTokenFromBody = req.body.clientRefreshToken;

	if (!clientRefreshTokenFromBody) {
		return res.status(400).json({
      code: 400,
      message: 'Refresh token not found'
    });
	}

	const accessTokenSecret = process.env.CLIENT_ACCESS_TOKEN_SECRET
	const accessTokenLife = process.env.CLIENT_ACCESS_TOKEN_LIFE

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

	const user = await ClientAccount.findOne({
    _id: id
  });
	if (!user) {
		return res.status(401).send('User not exists.');
	}

	if (clientRefreshTokenFromBody !== user['clientRefreshToken']) {
		return res.status(400).send('client refresh token token not legit.');
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

// [GET] /auth/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("clientAccessToken");
  res.send({
    code: 200,
    success: true
  })
}