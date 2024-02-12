import { Request, Response, NextFunction } from 'express';
import AdminAccount from '../../api/v1/models/adminAccount.model';
import { verifyToken } from '../../helpers/auth.methods';

export const authRequire = async (req: Request, res: Response, next: NextFunction) => {
  try {
      // Get access token from header
      const accessTokenFromHeader = req.headers['authorization'];

      if (!accessTokenFromHeader) {
          return res.status(401).json({
            code: 401,
            message: 'Can not found access token!'
          });
      }

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

      const verified: any = await verifyToken(
        accessTokenFromHeader,
        accessTokenSecret,
      );

      if (!verified) {
        return res.status(401).json({
          code: 401,
          message: "You don't have permission to access this feature"
        });
      }

      const user = await AdminAccount.findOne({ _id: verified.payload.username });
      req["user"] = user;

      return next();

  } catch (error) {
    console.error('Error in isAuth middleware:', error);
    return res.status(401).json({
      code: 401,
      message: 'Authorization failed'
    });
  }
};