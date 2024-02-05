import mongoose from 'mongoose';
import { statusValues } from '../../../commonTypes';
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    title: String,
    position: Number,
    images: Array,
    description: String,
    parent_id: String,
    status: {
      type: String,
      enum: statusValues
    },
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

const Category = mongoose.model("Categories", categorySchema, "property-categories");

export default Category;
