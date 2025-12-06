/* eslint-disable no-unused-vars */
import React, { useContext, useRef } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { UsersContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Customize = () => {
  const inputimage = useRef(null);

  const {
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    backendImage,
    selectedImage,
    setFrontendImage,
    setSelectedImage,
    setbackendImage,
  } = useContext(UsersContext);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setbackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage("input");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col py-10 px-5 overflow-hidden">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer hover:scale-110 transition-transform z-10"
        onClick={() => navigate("/home")}
      />

      <div className="flex flex-col items-center justify-center w-full h-full overflow-y-auto">
        <h1 className="text-white text-[28px] sm:text-[30px] md:text-[35px] text-center mb-[30px] px-4">
          Select your <span className="text-blue-300">Assistant Image</span>
        </h1>

        <div className="w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] flex justify-center items-center flex-wrap gap-5 sm:gap-6 md:gap-8 mb-6">
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={image7} />

          {/* Upload Image Card */}
          <div
            className={`w-[120px] h-[200px] sm:w-[140px] sm:h-[230px] md:w-[150px] md:h-[250px] lg:w-[170px] lg:h-[270px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
              selectedImage === "input"
                ? "border-4 border-white shadow-2xl shadow-blue-950"
                : ""
            } transition-all duration-300`}
            onClick={() => {
              inputimage.current.click();
            }}
          >
            {!frontendImage && (
              <RiImageAddLine className="text-white w-6 h-6 sm:w-[25px] sm:h-[25px]" />
            )}
            {frontendImage && (
              <img
                src={frontendImage}
                alt="Selected"
                className="h-full object-cover"
              />
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            ref={inputimage}
            className="hidden"
            onChange={handleImage}
          />
        </div>

        {selectedImage && (
          <button
            onClick={() => navigate("/customize2")}
            className="min-w-[150px] h-[60px] mb-6 text-black font-semibold bg-white rounded-full text-[19px] hover:bg-gray-200 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Customize;