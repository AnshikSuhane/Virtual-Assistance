import jwt from "jsonwebtoken";

export const genToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
  } catch (error) {
    console.log("JWT error:", error);
  }
};
