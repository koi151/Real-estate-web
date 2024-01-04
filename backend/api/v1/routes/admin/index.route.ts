import { Express } from "express";
import { systemConfig } from "../../../../configs/system";

import { propertiesRoutes } from "./properties.route";

const v1AdminRoutes = (app: Express): void => {
  const ADMIN_PATH: string = systemConfig.adminPrefix;
  const version: string = "/api/v1";

  app.use(`${version}/${ADMIN_PATH}/properties`, propertiesRoutes);
}

export default v1AdminRoutes;