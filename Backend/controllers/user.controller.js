import { uploadOnCloudinary } from "../configs/cloudinary.js";
import { Usermodel } from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Usermodel.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageURL } = req.body;

    let assistantImage;

    // If new image upload is provided
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageURL;
    }

    const user = await Usermodel.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage, 
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
