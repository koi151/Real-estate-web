import { Express } from "express";
import { systemConfig } from "../../../../configs/system";

import { propertiesRoutes } from "./properties.router";
import { propertyCategoriesRoutes } from "./property-categories.router";
import { RolesRoutes } from "./roles.router";

const v1AdminRoutes = (app: Express): void => {
  const ADMIN_PATH: string = systemConfig.adminPrefix;
  const version: string = "/api/v1";

  app.use(`${version}/${ADMIN_PATH}/properties`, propertiesRoutes);

  app.use(`${version}/${ADMIN_PATH}/property-categories`, propertyCategoriesRoutes);

  app.use(`${version}/${ADMIN_PATH}/roles`, RolesRoutes);

}

export default v1AdminRoutes;