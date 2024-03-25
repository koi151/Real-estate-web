import { Express } from "express";
import { systemConfig } from "../../../../configs/system";

import { propertiesRoutes } from "./properties.router";
import { propertyCategoriesRoutes } from "./property-categories.router";
import { rolesRoutes } from "./roles.router";
import { adminAccountRoutes } from "./admin-accounts.router";
import { clientAccountRoutes } from "./client-accounts.router";
import { authRoutes } from "./auth.router";
import { authRequire } from "../../../../middlewares/admin/auth.middleware";
import { dashboardRoutes } from "./dashboard.router";

const v1AdminRoutes = (app: Express): void => {
  const ADMIN_PATH: string = systemConfig.adminPrefix;
  const version: string = "/api/v1";

  app.use(
    `${version}/${ADMIN_PATH}/dashboard`, 
    authRequire,
    dashboardRoutes
  );

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
    `${version}/${ADMIN_PATH}/admin-accounts`, 
    authRequire,
    adminAccountRoutes
  );

  app.use(
    `${version}/${ADMIN_PATH}/client-accounts`, 
    authRequire,
    clientAccountRoutes
  );

  app.use(`${version}/${ADMIN_PATH}/auth`, authRoutes);
}

export default v1AdminRoutes;