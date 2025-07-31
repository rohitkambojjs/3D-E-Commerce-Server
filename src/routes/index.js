import { Router } from "express";
import authRoute from "./auth.routes.js"
import productRoute from "./product.routes.js"
import userRouter from "./user.routes.js"

const router = Router()

router.use("/auth", authRoute)
router.use("/product", productRoute)
router.use("/user", userRouter)

export default router