import express, { Express } from 'express';
import * as database from './configs/database';
import { systemConfig } from './configs/system';
import cookieParser from 'cookie-parser';

import methodOverride from 'method-override';
import cors from "cors";
import dotenv from "dotenv"; 
import path from 'path';
import moment from 'moment';

dotenv.config();
database.connect();

import v1AdminRoutes from "./api/v1/routes/admin/index.router";
import v1ClientRoutes from './api/v1/routes/client/index.router';


const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(methodOverride('_method'));

const allowedOrigins = ['http://localhost:3001'];
const corsOptions: cors.CorsOptions = {
  origin: function (origin: string, callback: (err: Error | null, allow: boolean) => void) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
v1ClientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Start Agenda --------------------------------
import Agenda from 'agenda';
import mongoose from 'mongoose';

const agenda = new Agenda({db: {address: process.env.MONGO_URL}});

// check expireTime of properties
agenda.define('setDeleteFlag', async () => {
  const collection = mongoose.connection.collection('properties');
  const now = new Date();

  await collection.updateMany(
    { expireTime: { $lt: now } },
    { $set: { deleted: true } }
  );
});

(async function() {
  await agenda.start();
  console.log('Agenda started')
  await agenda.every('1 minute', 'setDeleteFlag');
})();