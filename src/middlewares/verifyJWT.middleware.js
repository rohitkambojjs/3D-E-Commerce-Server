import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized request"))
        }

        const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res.status(401).json(new ApiResponse(401, null, "Invalid Access Token"))
        }

        req.user = user;
        next()
    } catch (error) {
        console.log(`verifyJWT.middleware.js :: verifyJWT :: error :: ${error}`);

        return res.status(401).json(new ApiResponse(401, null, error?.message || "Invalid access token"))
    }
}