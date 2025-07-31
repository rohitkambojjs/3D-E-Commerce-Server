import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../middlewares/cloudinary.js"

export const getAllProduct = async (req, res) => {
  console.log(req.user);

  const {
    owner,
    title,
    description,
    price,
    discount,
    status,
    offerName,
    offerStart,
    offerEnd,
  } = req.query;

  const query = {};

  if (owner) {
    query.owner = owner;
  }
  if (title) {
    query.title = title;
  }
  if (description) {
    query.description = description;
  }
  if (price) {
    query.price = price;
  }
  if (discount) {
    query.discount = discount;
  }
  if (status) {
    query.status = status;
  }
  if (offerName) {
    query.offerName = offerName;
  }
  if (offerStart) {
    query.offerStart = offerStart;
  }
  if (offerEnd) {
    query.offerEnd = offerEnd;
  }
  try {
    const product = await Product.find(query);
    if (product.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, product, "Product is empty"));
    }
    return res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    console.log(`product.controller.js :: getAllProduct :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const getOneProduct = async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById({ _id });
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, product, "Product is not found"));
    }
    return res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    console.log(`product.controller.js :: getOneProduct :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const createProduct = async (req, res) => {
  const userId = req.user._id
  const body = JSON.parse(req.body.data);
  console.log(`body`, body);
  const file = req.file;
  console.log(file);
  delete body._id
  
  try {
    const imageURL = await uploadOnCloudinary(file.path)
    console.log("imageURL", imageURL);
    `body`, body.imageURL = imageURL.secure_url
    const product = await Product.create(body);
    const owner = await User.findById({ _id: userId })
    owner.myProducts.push(product._id)
    owner.save()
    return res
      .status(200)
      .json(new ApiResponse(200, product, `Product created successfully`));
  } catch (error) {
    console.log(`product.controller.js :: createProduct :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};
// export const createProduct = async (req, res) => {
//   const body = req.body;
//   try {
//     const productImageLocalPath = req.files;
//     const imageURL = await uploadOnCloudinary(productImageLocalPath)
//     body.imageURL = imageURL
//     const product = await Product.create(body);
//     const owner = await User.findById({ _id: product.owner })
//     owner.myProducts.push(product._id)
//     owner.save()
//     return res
//       .status(200)
//       .json(new ApiResponse(200, product, `Product created successfully`));
//   } catch (error) {
//     console.log(`product.controller.js :: createProduct :: error :: ${error}`);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, null, "Internal Server Error"));
//   }
// };

export const updateProduct = async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const product = await Product.findByIdAndUpdate({ _id }, body, {
      new: true,
    });
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, product, "Product is not updated"));
    }
    return res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    console.log(`product.controller.js :: updateProduct :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// TODO : When delete the product then remove product Id in user's myProduct Id
export const deleteProduct = async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete({ _id });
    if (!product) {
      return res
        .status(404)
        .json(new ApiResponse(404, product, "Product is not deleted"));
    }
    return res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    console.log(`product.controller.js :: deleteProduct :: error :: ${error}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product is not deleted"));
  }
};
