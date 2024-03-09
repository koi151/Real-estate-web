import { Express } from "express";

import { propertiesRoutes } from "./properties.router";
import { thirdPartyRoutes } from "./third-party.router";
import { authRequire } from "../../../../middlewares/client/auth.middleware";
import { authRoutesClient } from "./auth-client.router";
import { propertyCategoriesRoutesClient } from "./property-categories.router";

const v1ClientRoutes = (app: Express): void => {
  const version: string = "/api/v1";

  app.use(
    `${version}/properties`, 
    authRequire,
    propertiesRoutes
  );

  app.use(
    `${version}/property-categories`, 
    authRequire,
    propertyCategoriesRoutesClient
  );
  
  app.use(
    `${version}/third-party-api`, 
    authRequire,
    thirdPartyRoutes
  );

  app.use(`${version}/auth`, authRoutesClient);
}

export default v1ClientRoutes;