import mongoose from 'mongoose';
import { statusValues } from '../../../commonTypes';
// import { generateRandomString } from '../../../helpers/generateString';

const adminAccountSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    role_id: String,
    phone: String,
    avatar: String,
    postList: [String],
    favoritePosts: [String],
    status: {
      type: String,
      enum: statusValues
    },    
    createdAt: Date,
    expireAt: Date,
    deleted: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

const AdminAccount = mongoose.model("AdminAccount", adminAccountSchema, "admin-accounts");

export default AdminAccount;
