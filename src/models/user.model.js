import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isUserLogin: {
    type: Boolean,
    required: true,
  },
  // userStatus: {
  //   type: String,
  //   required: true,
  //   enum: ["Login", "Logout"],
  // },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  age: {
    type: Number,
  },
  address: {
    type: Number,
  },
  cartProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  myProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)