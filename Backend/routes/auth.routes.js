import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", login);
authRouter.post("/logout", logout);
