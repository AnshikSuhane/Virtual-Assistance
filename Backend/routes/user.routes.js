import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

export const userRouter=express.Router();

userRouter.get("/current",isAuth,getCurrentUser)