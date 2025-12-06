/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { UsersContext } from "../context/UserContext";

const Card = ({ image }) => {
  const {
    selectedImage,
    setSelectedImage,
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    backendImage,
    setFrontendImage,
    setbackendImage,
  } = useContext(UsersContext);

  return (
    <div
      className={`w-[120px] h-[200px] sm:w-[140px] sm:h-[230px] md:w-[150px] md:h-[250px] lg:w-[170px] lg:h-[270px] 
        bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden 
        hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
        ${
          selectedImage === image
            ? "border-4 border-white shadow-2xl shadow-blue-950"
            : null
        }
        transition-all duration-300`}
      onClick={() => {
        setSelectedImage(image);
        setbackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img
        src={image}
        alt="custom card"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Card;
