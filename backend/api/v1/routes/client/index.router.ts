import { Express } from "express";

import { propertiesRoutes } from "./properties.router";
import { thirdPartyRoutes } from "./third-party.router";

const v1ClientRoutes = (app: Express): void => {
  const version: string = "/api/v1";

  app.use(
    `${version}/properties`, 
    propertiesRoutes
  );

  
  app.use(
    `${version}/third-party-api`, 
    thirdPartyRoutes
  );

  // app.use(`${version}/${ADMIN_PATH}/auth`, authRoutes);

}

export default v1ClientRoutes;