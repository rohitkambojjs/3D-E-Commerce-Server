import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  productType: {
    type: String,
    required: true,
    enum: ["Weapons", "Shoes", "Garment", "Toys", "SmartPhone"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  netPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["ComeingSoon", "Available", "OutOfStock", "Private"],
    default: "Private"
  },
  imageURL: {
    type: String,
    required: true
  },
  offerName: {
    type: String,
  },
  offerStart: {
    type: Date,
  },
  offerEnd: {
    type: Date,
  }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)