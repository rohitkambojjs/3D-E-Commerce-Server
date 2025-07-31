import { Router } from "express";
import { getCurrentUser, login, logout, registerUser } from "../controller/auth.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js"

const router = Router()

router.route("/register-user").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)

export default router