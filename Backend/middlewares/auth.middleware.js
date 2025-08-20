import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
