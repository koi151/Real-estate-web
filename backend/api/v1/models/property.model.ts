import mongoose from 'mongoose';
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const listingTypeValues = ["forSale", "forRent"];
const postTypeValues = ["default", "preminum", "featured"];
const statusValues = ["active", "inactive"];

const propertySchema = new mongoose.Schema(
  {
    title: String,
    listingType: {
      type: String, 
      enum: listingTypeValues
    },
    postType: {
      type: String,
      default: "default",
      enum: postTypeValues,
    },
    description: String,
    price: Number,
    area: {
      length: Number,
      width: Number
    },
    images: Array,
    view: Number,
    status: {
      type: String,
      enum: statusValues
    },
    location: {
      city: String,
      district: String,
      address: String
    },
    propertyDetails: {
      propertyType: String,
      subType: String,
      features: Array,
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
    expireAt: Date
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema, "properties");

export default Property;
