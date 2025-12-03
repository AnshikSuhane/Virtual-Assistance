import express from "express";
import "dotenv/config";
import connectDb from "./configs/db.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import { userRouter } from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";
import { geminiRouter } from "./routes/gemini.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/gemini", geminiRouter );

app.get("/",async(req,res)=>{
  let prompt=req.query.prompt
  let data=await geminiResponse(prompt)
  res.json(data)
})
const PORT = process.env.PORT || 8000;

connectDb(); 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
