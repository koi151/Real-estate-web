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
      default: "default",
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
    expireTime: Date
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema, "properties");

// Luồng thay đổi
Property.watch().on('change', async (change) => {
  if (change.operationType === 'update' && change.updateDescription.updatedFields.expireTime) {
    // Nếu thời gian hết hạn đã được cập nhật
    const doc = await Property.findOne({ _id: change.documentKey._id });
    if (doc.expireTime < new Date()) {
      // Nếu thời gian hết hạn đã qua, cập nhật trường deleted thành true
      await Property.updateOne({ _id: change.documentKey._id }, { $set: { deleted: true } });
    }
  }
});

export default Property;
