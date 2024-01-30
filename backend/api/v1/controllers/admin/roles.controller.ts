import { Request, Response } from "express"

import Role from "../../models/roles.model";


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
    res.status(400).json({
      code: 400,
      message: "Error occurred while fetching roles data"
    })
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
    res.status(400).json({
      code: 400,
      message: "Error occurred while deleting role"
    })
  }
}