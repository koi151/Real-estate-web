import { Request, Response } from "express";

// [GET] /admin/third-party-api/google-cloud
export const googleCloudAPI = (req: Request, res: Response) => {
  try {
    const apiKey: string | undefined = process.env.GOOGLE_CLOUD_API_KEY;
    if (apiKey) {
      res.status(200).json({
        code: 200,
        apiKey: apiKey,
        message: "Success"
      })
    } else {
      res.json({
        code: 400,
        apiKey: apiKey,
        message: "Can not get API key"
      })
    }

  } catch (err) {
    console.log('Error occurred while fetching Google Clound API:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}

// [GET] /admin/third-party-api/open-cage
export const openCageApiKey = (req: Request, res: Response) => {
  try {
    const apiKey: string | undefined = process.env.OPEN_CAGE_API_KEY;
    if (apiKey) {
      res.status(200).json({
        code: 200,
        apiKey: apiKey,
        message: "Success"
      })
    } else {
      res.json({
        code: 400,
        apiKey: apiKey,
        message: "Can not get API key"
      })
    }

  } catch (err) {
    console.log('Error occurred while fetching Google Clound API:', err);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  }
}