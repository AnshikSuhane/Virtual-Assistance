import express from "express";
import { getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

export const userRouter=express.Router();

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)