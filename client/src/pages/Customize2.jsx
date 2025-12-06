import React, { useContext, useState } from "react";
import { UsersContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData, backendImage, serverUrl, setuserData, selectedImage } =
    useContext(UsersContext);
  const [name, setName] = useState(userData?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStateAssistant = async () => {
    if (!name.trim()) {
      setError("Please enter an assistant name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("assistantName", name.trim());
      
      if (backendImage) {
        formData.append("image", backendImage);
      } else if (selectedImage) {
        formData.append("imageURL", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (result.data) {
        setuserData(result.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating assistant:", error);
      setError(error.response?.data?.message || "Failed to update assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && name.trim()) {
      handleStateAssistant();
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col py-10 px-5 overflow-hidden">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer hover:scale-110 transition-transform z-10"
        onClick={() => navigate("/customize")}
      />
      
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-white mb-[40px] text-[28px] sm:text-[30px] md:text-[35px] text-center px-4">
          Enter Your <span className="text-blue-300">Assistant Name</span>
        </h1>
        
        <input
          type="text"
          placeholder="eg: Ruchi"
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          value={name}
          className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] focus:border-blue-300 transition-colors"
          required
          disabled={loading}
        />
        
        {error && (
          <p className="text-red-400 mt-4 text-[16px] text-center">{error}</p>
        )}
        
        {name.trim() && (
          <button
            onClick={handleStateAssistant}
            disabled={loading}
            className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Finally Create Your Assistant"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Customize2;