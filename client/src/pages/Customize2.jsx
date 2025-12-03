/* eslint-disable no-undef */
import React, { useContext, useState } from "react";
import { UsersContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const Customize2 = () => {
  const { userData, backendImage, serverUrl, setuserData, selectedImage } =
    useContext(UsersContext);
  const [name, setName] = useState(userData?.name || " ");
  // eslint-disable-next-line no-unused-vars
  const [loading, setloading] = useState(false);
  const navigate=useNavigate()
  const handleStateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", name);
      if (backendImage) {
        formData.append("image", backendImage);
      } else {
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

      console.log(result.data);
      setuserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col py-10">
      <IoMdArrowRoundBack  className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer " onClick={()=>navigate("/customize")} />
      <h1 className="text-white mb-[40px] text-[30px] text-center ">
        Enter Your <span className="text-blue-300">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg: Ruchi"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className="w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
      />
      {name && (
        <button
          onClick={() => {
            handleStateAssistant();
          }}
          className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]"
        >
          {!loading ? "Finally Create Your Assistant" : "Loading"}
        </button>
      )}
    </div>
  );
};

export default Customize2;
