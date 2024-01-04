import mongoose from 'mongoose';
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const propertySchema = new mongoose.Schema(
  {
    title: String,
    listingType: String,
    description: String,
    price: Number,
    area: {
      length: Number,
      width: Number
    },
    images: Array,
    status: String,
    location: {
      city: String,
      district: String
    },
    propertyDetails: {
      type: String,
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
    }
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema, "properties");

export default Property;
