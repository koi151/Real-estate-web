import express, { Express } from 'express';
import * as database from './configs/database';
import { systemConfig } from './configs/system';

import cors from "cors";
import dotenv from "dotenv"; 
import path from 'path';
import moment from 'moment';

import v1AdminRoutes from "./api/v1/routes/admin/index.route";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`));

// TinyMCE
app.use(
  '/tinymce',
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// App local variables
app.locals.adminPrefix = systemConfig.adminPrefix;
app.locals.moment = moment;

// Admin routes
v1AdminRoutes(app);

// Client routes
// clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
