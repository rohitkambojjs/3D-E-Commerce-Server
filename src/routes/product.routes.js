import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { verifyJWT } from '../middlewares/verifyJWT.middleware.js';
import { upload } from "../middlewares/multer.middleware.js"
const router = Router();
router.use(verifyJWT)

router.route("/").get(getAllProduct).post(upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getOneProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
