import { response } from "express";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "User already exists"));
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await User.create({
      email,
      password: hashPassword,
      firstName,
      lastName,
      isUserLogin: true,
    });

    const userData = {
      _id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      isUserLogin: createdUser.isUserLogin,
    };

    const token = jwt.sign(userData, process.env.AUTH_TOKEN_SECRET, {
      expiresIn: process.env.AUTH_TOKEN_EXPIRY,
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    res.cookie("token", token, options);
    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    console.log(`auth.controller.js :: registerUser :: error :: ${error}`);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `User registeration is faild :: error :: ${error}`
        )
      );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(409)
        .json(new ApiResponse(409, existingUser, "You are not registered"));
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password);
    console.log(checkPassword);

    if (!checkPassword) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Email or Password is wrong"));
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id: existingUser._id },
      { isUserLogin: true },
      { new: true }
    );

    const userData = {
      _id: updateUser._id,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      email: updateUser.email,
      isUserLogin: updateUser.isUserLogin,
    };

    const token = jwt.sign(userData, process.env.AUTH_TOKEN_SECRET, {
      expiresIn: process.env.AUTH_TOKEN_EXPIRY,
    });

    res.cookie("token", token);
    return res
      .status(200)
      .json(new ApiResponse(200, existingUser, "User login successfully"));
  } catch (error) {
    console.log(`auth.controller.js :: login :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Login faild :: error :: ${error}`));
  }
};

export const logout = async (req, res) => {
  const user = req.user;
  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { isUserLogin: false },
      { new: true }
    );
    res.cookie("token", token);
    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User logout successfully"));
  } catch (error) {
    console.log(`auth.controller.js :: logout :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Logout faild :: error :: ${error}`));
  }
};

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  try {
    const response = await User.findById({ _id: user._id }).populate([
      "cartProducts",
      "myProducts",
    ]);
    return res.status(200).json(new ApiResponse(200, response));
  } catch (error) {
    console.log(`auth.controller.js :: getCurrentUser :: error :: ${error}`);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Get current user is faild :: error :: ${error}`
        )
      );
  }
};

// export const getCurrentUserWithData = async (req, res) => {
//   const user = req.user;
//   try {
//     const response = await User.findById({ _id: user._id }).populate([
//       "cartProducts",
//       "myProducts",
//     ]);
//     return res.status(200).json(new ApiResponse(200, response));
//   } catch (error) {
//     console.log(`auth.controller.js :: getCurrentUser :: error :: ${error}`);
//     return res
//       .status(500)
//       .json(
//         new ApiResponse(
//           500,
//           null,
//           `Get current user is faild :: error :: ${error}`
//         )
//       );
//   }
// };
