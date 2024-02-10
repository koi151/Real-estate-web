import { Request, Response, NextFunction } from 'express';
import AdminAccount from '../../api/v1/models/adminAccount.model';
import Role from '../../api/v1/models/roles.model';
import { AdminAccountType, RolesType } from '../../commonTypes';

export const authRequire = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    console.log("token:", token)

    if (!token) {
      res.clearCookie('token');
      return res.redirect('http://localhost:3001/admin/auth/login');
    }

    const user: AdminAccountType | null = await AdminAccount.findOne({
      token,
      deleted: false
    });

    console.log("user:", user)

    if (!user) {
      res.clearCookie('token');
      return res.redirect('http://localhost:3001/admin/auth/login');
    }

    const role: RolesType | null = await Role.findOne({
      _id: user.role_id 
    }).select('title permissions');

    console.log("role:", role)

    res.locals.user = user;
    res.locals.role = role;
    next();

  } catch (err) {
    console.error('Error in authRequire middleware:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};