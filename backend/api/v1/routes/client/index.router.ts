import { Express } from "express";
import { systemConfig } from "../../../../configs/system";

import { propertiesRoutes } from "./properties.router";

const v1ClientRoutes = (app: Express): void => {
  const ADMIN_PATH: string = systemConfig.adminPrefix;
  const version: string = "/api/v1";

  app.use(
    `${version}/${ADMIN_PATH}/properties`, 
    propertiesRoutes
  );

  // app.use(`${version}/${ADMIN_PATH}/auth`, authRoutes);

}

export default v1ClientRoutes;