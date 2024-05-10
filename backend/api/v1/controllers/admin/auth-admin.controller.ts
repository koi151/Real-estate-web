import { Request, Response } from "express";
import bcrypt from 'bcrypt';

import AdminAccount from "../../models/adminAccount.model";
import { processAccountLoginData, processAccountRegisterData } from "../../../../helpers/processData";
import { AccountLoginType, AccountRegisterType, AdminAccountType } from "../../../../commonTypes";
import { decodeToken, generateToken } from "../../../../helpers/auth.methods";
import Role from "../../models/roles.model";
import { formattedPermissions } from "../../../../helpers/formatData";

// [POST] /admin/auth/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const registerInfo: AccountRegisterType = await processAccountRegisterData(req);
    registerInfo['status'] = 'pending';

    if (registerInfo.email) {
      const userExisted = await AdminAccount.findOne({
        email: registerInfo.email,
      })

      if (userExisted) {
        return res.status(409).json({
          code: 409,
          message: "Email existed"
        })
      }

      const newAccount = new AdminAccount(registerInfo);
      await newAccount.save();
      
      return res.status(200).json({
        code: 200,
        message: "New account created successfully"
      })
      
    } else {
      return res.status(400).json({
        code: 400,
        message: "Email is empty"
      })
    }

  } catch (err: any) {
    console.log('Error occurred while registering admin account:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const userInfo: AccountLoginType = await processAccountLoginData(req);

    const user: AdminAccountType = await AdminAccount.findOne({ 
      email: userInfo.email,
      deleted: false
    });

    if (!user || !bcrypt.compareSync(userInfo.password, user.password)) {
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
  
    // let refreshToken = generateRandomString(30);

    // if (!user.token) {
    //   await AdminAccount.updateOne({
    //     _id: user._id,
    //     refreshToken: refreshToken
    //   })
    // } else {
    //   refreshToken = user.token;
    // }

    const userPermissions = await Role.findOne({
      _id: user.role_id,
      deleted: false
    }).select('permissions -_id')

    if (!userPermissions) {
      return res.status(400).json({
        code: 400,
        message: 'Can not get permissions of account',
      });
    }

    // convert document to JSON
    const regularUserObj = { ...user['_doc'] };

    const permissionObj: { [key: string]: boolean } = userPermissions.permissions.reduce((acc, item) => {
      acc[formattedPermissions(item)] = true;
      return acc;
    }, {});
    
    delete regularUserObj['password'];
    delete regularUserObj["accessToken"];
    delete regularUserObj["token"];    

    regularUserObj['permissions'] = permissionObj;
    
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict',
      path: '/' 
    })

    res.status(200).json({
      code: 200,
      message: 'Success',
      user: regularUserObj
    });


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


// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.send({
    code: 200,
    success: true
  })
}