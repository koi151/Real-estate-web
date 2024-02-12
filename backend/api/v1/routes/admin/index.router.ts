import { Express } from "express";
import { systemConfig } from "../../../../configs/system";

import { propertiesRoutes } from "./properties.router";
import { propertyCategoriesRoutes } from "./property-categories.router";
import { rolesRoutes } from "./roles.router";
import { accountsRoutes } from "./accounts.router";
import { authRoutes } from "./auth.router";
import { authRequire } from "../../../../middlewares/admin/auth.middleware";

const v1AdminRoutes = (app: Express): void => {
  const ADMIN_PATH: string = systemConfig.adminPrefix;
  const version: string = "/api/v1";

  app.use(
    `${version}/${ADMIN_PATH}/properties`, 
    authRequire,
    propertiesRoutes
  );

  app.use(
    `${version}/${ADMIN_PATH}/property-categories`, 
    authRequire,
    propertyCategoriesRoutes
  );

  app.use(
    `${version}/${ADMIN_PATH}/roles`, 
    authRequire,
    rolesRoutes
  );

  app.use(
    `${version}/${ADMIN_PATH}/accounts`, 
    authRequire,
    accountsRoutes
  );

  app.use(
    `${version}/${ADMIN_PATH}/accounts`, 
    authRequire,
    accountsRoutes
  );

  app.use(`${version}/${ADMIN_PATH}/auth`, authRoutes);

}

export default v1AdminRoutes;