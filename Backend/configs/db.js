import mongoose from "mongoose";
const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected successfully✅✅");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}
export default connectDb;