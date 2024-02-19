import mongoose from 'mongoose';
const slug = require('mongoose-slug-updater');
import { listingTypeValues, postTypeValues, statusValues } from '../../../commonTypes';

mongoose.plugin(slug);

const propertySchema = new mongoose.Schema(
  {
    title: String,
    position: Number,
    listingType: {
      type: String, 
      enum: listingTypeValues,
    },
    postType: {
      type: String,
      default: "standard",
      enum: postTypeValues,
    },
    description: String,
    price: Number,
    area: {
      propertyLength: Number,
      propertyWidth: Number
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
      ward: String,
      address: String
    },
    propertyDetails: {
      propertyCategory: String,
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
    expireTime: Date
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema, "properties");

export default Property;
