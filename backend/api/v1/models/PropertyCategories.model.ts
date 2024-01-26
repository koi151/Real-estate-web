import mongoose from 'mongoose';
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    title: String,
    position: Number,
    images: Array,
    description: String,
    parent_id: String,
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

const Category = mongoose.model("Categories", categorySchema, "categories");

export default Category;
