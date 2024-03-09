import mongoose from 'mongoose';
import { statusValues } from '../../../commonTypes';
import { generateRandomString } from '../../../helpers/generateString';

const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const clientAccountSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    token: {
      type: String,
      default: generateRandomString(30)
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      enum: statusValues
    },    
    createdAt: Date,
    expireAt: Date,
    slug: {
      type: String, 
      slug: "title",
      unique: true 
    },
    deleted: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const ClientAccount = mongoose.model("clientAccount", clientAccountSchema, "client-accounts");

export default ClientAccount;
