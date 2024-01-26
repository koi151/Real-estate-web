import { Express } from "express";
import { systemConfig } from "../../../../configs/system";

import { propertiesRoutes } from "./properties.routes";
import { propertyCategoriesRoutes } from "./property-categories.routes";

const v1AdminRoutes = (app: Express): void => {
  const ADMIN_PATH: string = systemConfig.adminPrefix;
  const version: string = "/api/v1";

  app.use(`${version}/${ADMIN_PATH}/properties`, propertiesRoutes);

  app.use(`${version}/${ADMIN_PATH}/property-categories`, propertyCategoriesRoutes);

}

export default v1AdminRoutes;