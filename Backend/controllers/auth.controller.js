import { genToken } from "../configs/token.js";
import { Usermodel } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Usermodel.create({ name, email, password: hashedPassword });

    const token = genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      secure: false,
    });

    res.status(201).json({ success: true, message: "Successfully signed up", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: `Sign up error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usermodel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Email does not exist" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    res.status(200).json({ success: true, message: "Successfully logged in", user });
  } catch (error) {
    res.status(500).json({ success: false, message: `Login error: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Logout error: ${error.message}` });
  }
};
