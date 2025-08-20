import express from "express";
import "dotenv/config";
import connectDb from "./configs/db.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import { userRouter } from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // no trailing slash
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8000;

connectDb(); // Connect to MongoDB first
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
