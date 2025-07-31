import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    age,
    address,
  } = req.query;

  const query = {};

  if (firstName) {
    query.firstName = firstName;
  }
  if (lastName) {
    query.lastName = lastName;
  }
  if (email) {
    query.email = email;
  }
  if (age) {
    query.age = age;
  }
  if (address) {
    query.address = address;
  }
  try {
    const user = await User.find(query);
    if (user.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, user, "User is empty"));
    }
    return res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    console.log(`user.controller.js :: getAllUser :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const getOneUser = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById({ _id });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, user, "User is not found"));
    }
    return res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    console.log(`user.controller.js :: getOneUser :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const updateUser = async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id }, body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, user, "User is not updated"));
    }
    return res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    console.log(`user.controller.js :: updateUser :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete({ _id });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, user, "User is not deleted"));
    }
    return res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    console.log(`user.controller.js :: deleteUser :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const getAllCartProduct = async (req, res) => {
  const _id = req.user._id
  try {
    const findUser = await User.findById({ _id }).populate("cartProducts")

    if (findUser.cartProducts.length === 0) {
      return res.status(404).json(new ApiResponse(404, findUser.cartProducts, `Cart collection is empty`))
    }
    return res.status(200).json(new ApiResponse(200, findUser.cartProducts))
  } catch (error) {
    console.log(`user.controller.js :: getAllCartProduct :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, error));
  }
}

export const addProductInCart = async (req, res) => {
  const _id = req.user._id
  const body = req.body
  console.log(body);

  try {
    const findUser = await User.findById({ _id })
    const findProduct = findUser.cartProducts.find((x) => x.toString() === body._id.toString())
    if (findProduct) {
      return res.status(201).json(new ApiResponse(201, findProduct, `This product allReady exist`))
    }
    findUser.cartProducts.push(body._id)
    await findUser.save();
    return res.status(200).json(new ApiResponse(200, findUser, "This product add in cart"))
  } catch (error) {
    console.log(`user.controller.js :: addProductInCart :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, error));
  }
}

// ✅ remove product from cart
export const removeProductInCart = async (req, res) => {
  const _id = req.user._id
  const productId = req.params.id;
  try {
    const findUser = await User.findById({ _id });
    const newArray = findUser.cartProducts.filter(
      (x) => x.toString() !== productId.toString()
    );
    findUser.cartProducts = newArray;
    await findUser.save();
    return res
      .status(200)
      .json(new ApiResponse(200, findUser, "Product removed from cart"));
  } catch (error) {
    console.log(`user.controller.js :: removeProductInCart :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, error));
  }
};