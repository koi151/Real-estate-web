import { Request, Response, NextFunction } from 'express';
import AdminAccount from '../../api/v1/models/adminAccount.model';
import { verifyToken } from '../../helpers/auth.methods';
import Role from '../../api/v1/models/roles.model';

export const authRequire = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(400).json({
        code: 400,
        message: 'No access token found.'
      });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified: any = await verifyToken(
      accessToken,
      accessTokenSecret,
    );

    if (!verified) {
      return res.status(401).json({
        code: 401,
        message: "Don't have permission"
      });
    }

    // Fetch user
    const user = await AdminAccount.findOne(
      { _id: verified.payload.username }
    ).select('-password');


    if (!user) {
      return res.status(401).json({
        code: 401,
        message: 'User not found'
      });
    }

    const userRole = await Role.findOne({ 
      _id: user.role_id, 
      deleted: false 
    }).select('permissions');

    res.locals.currentUser = user;
    res.locals.currentUser.permissions = userRole?.permissions;

    return next();

  } catch (error) {
    console.error('Error in authRequire middleware:', error);
    return res.status(401).json({
      code: 401,
      message: 'Authorization failed'
    });
  }
};
