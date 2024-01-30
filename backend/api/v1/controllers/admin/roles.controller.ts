import { Request, Response } from "express"

import Role from "../../models/roles.model";
import { RolesType } from "../../../../commonTypes";

const processRoleData = (req: Request): RolesType => {
  return {
    title: req.body.title || '',
    description: req.body.description || '',
    permissions: Array.isArray(req.body.permissions) ? req.body.permissions : [req.body.permissions || ''],
    deleted: Boolean(req.body.deleted),
  };
}

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find({ deleted: false });
    
    if (roles.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        roles: roles
      })
    } else {
      res.status(400).json({
        code: 400,
        message: "No roles found"
      })  
    }

  } catch (error) {
    console.log("Error occurred, can not fetch roles data:", error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [GET] /admin/roles/detail/:roleId
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string | undefined = req.params.roleId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid role ID'
      });
    }
    
    const role = await Role.findOne(
      { _id: id }, 
      { deleted: false }
    )

    if (role) {
      res.status(200).json({
        code: 200,
        message: "Success",
        role: role
      })
    } else {
      res.status(400).json({
        code: 400,
        message: "Role not found"
      })
    }

  } catch (error) {
    console.log('Error occurred while fetching role data:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /admin/roles/edit/:roleId
export const editPatch = async (req: Request, res: Response) => {
  try {    
    const id: string | undefined = req.params.roleId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid role ID'
      });
    }

    const roleUpdated: RolesType = processRoleData(req);
    
    const result = await Role.updateOne(
      { _id: id },
      roleUpdated
    );

    if (result.matchedCount) {
      res.status(200).json({
        code: 200,
        message: 'Role updated successfully'
      })
    } else {
      res.status(400).json({
        code: 400,
        message: 'No role found'
      })
    }  

  } catch (error) {
    console.log('Error occurred while editing role:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [DELETE] /admin/roles/delete/:roleId
export const singleDelete = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.roleId;

    const result = await Role.updateOne(
      { _id: id },
      { deleted: true }
    )

    if (result.matchedCount) {
      res.status(200).json({
        code: 200,
        message: "Role deleted successfully"
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "Role not found"
      });
    }

  } catch (error) {
    console.log('Error occurred while deleting role:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}