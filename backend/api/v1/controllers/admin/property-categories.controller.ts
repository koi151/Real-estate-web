import { Request, Response } from "express"

export const index = (req: Request, res: Response) => {
  try {
    res.send('ok')

  } catch (error) {
    console.log("Error occurred:", error);
    res.status(400).json({
      code: 400,
      message: "Error occurred while fetching property categories data"
    })
  }
}