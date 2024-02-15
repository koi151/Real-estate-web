import { Request, Response } from "express"

import Role from "../../models/roles.model";
import { RolesType } from "../../../../commonTypes";
import { processRoleData } from "../../../../helpers/processData";
import { formattedPermissions } from "../../../../helpers/formatData";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-roles_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const roles = await Role.find({ deleted: false });
    
    if (roles.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        roles: roles,
        permissions: {
          administratorRolesView: res.locals.currentUser.permissions.includes('administrator-roles_view'),
          administratorRolesEdit: res.locals.currentUser.permissions.includes('administrator-roles_edit'),
          administratorRolesCreate: res.locals.currentUser.permissions.includes('administrator-roles_create'),
          administratorRolesDelete: res.locals.currentUser.permissions.includes('administrator-roles_delete')
        }
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

// [GET] /admin/roles/titles
export const roleTitles = async (req: Request, res: Response) => {
  try {
    if (!res.locals.currentUser.permissions.includes('administrator-roles_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const roleTitles = await Role.find({ deleted: false }).select('title');

    if (roleTitles.length > 0) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        roleTitles: roleTitles
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
    if (!res.locals.currentUser.permissions.includes('administrator-roles_view')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

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

// [GET] /admin/roles/permissions
export const currentAccPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = res.locals.currentUser.permissions;
    const permissionsObject = permissions.reduce((acc: any, item: string) => {
      const permission = formattedPermissions(item);
      acc[permission] = true;
      return acc;
    }, {});

    if (permissionsObject) {
      res.status(200).json({
        code: 200,
        message: 'Success',
        permissions: permissionsObject
      })
    } else {
      res.json({
        code: 400,
        message: 'No permission found',
        permissions: permissionsObject
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

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  try {    
    if (!res.locals.currentUser.permissions.includes('administrator-roles_create')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

    const role: RolesType = processRoleData(req);
    
    const newRole = new Role(role);
    await newRole.save();

    res.status(200).json({
      code: 200,
      message: 'Role created successfully'
    })

  } catch (error) {
    console.log('Error occurred while creating role:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [PATCH] /admin/roles/edit/:roleId
export const editPatch = async (req: Request, res: Response) => {
  try {    
    if (!res.locals.currentUser.permissions.includes('administrator-roles_edit')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }

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
    if (!res.locals.currentUser.permissions.includes('administrator-roles_delete')) {
      return res.json({
        code: 403,
        message: "Account does not have access rights"
      })
    }
  
    const id: string | undefined = req.params.roleId;
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid role ID'
      });
    }

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