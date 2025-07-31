import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  addProductInCart,
  deleteUser,
  getAllCartProduct,
  getAllUser,
  getOneUser,
  removeProductInCart,
  updateUser,
} from "../controller/user.controller.js";

const router = Router();

router.use(verifyJWT);
router.route("/").get(getAllUser);
router
  .route("/cart")
  .get(getAllCartProduct)
  .post(addProductInCart)

router.route("/cart/:id").delete(removeProductInCart)
router.route("/:id").get(getOneUser).patch(updateUser).delete(deleteUser);

export default router;
