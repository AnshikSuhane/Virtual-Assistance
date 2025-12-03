import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { askToAssistant } from "../controllers/gemini.controller.js";

export const geminiRouter = express.Router();

geminiRouter.post("/chat", isAuth, askToAssistant);
