import mongoose from 'mongoose';
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const roleSchema = new mongoose.Schema(
{
  title: String,
  description: String,
  permissions: [String],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
{ timestamps: true })

const Role = mongoose.model("Role", roleSchema, "roles");

export default Role;

