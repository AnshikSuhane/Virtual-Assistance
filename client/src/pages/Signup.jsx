/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { UsersContext } from "../context/UserContext";
import axios from "axios";

const Signup = () => {
  const { serverUrl, userData, setuserData } = useContext(UsersContext);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    seterror(""); // Clear any previous errors
    
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setuserData(result.data);
      navigate("/customize")
    } catch (error) {
      console.log(error);
      setuserData(null);
      seterror(error.response.data.message);
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  return (
    <div
      className="w-full flex justify-center items-center h-[100vh] bg-cover"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignup}
        className="w-[90%] h-[600px] max-w-[500px] bg-black/20 backdrop-blur shadow-black flex flex-col items-center justify-center gap-[20px] p-6"
      >
        <h1 className="text-white text-[30px] font-semibold text-center">
          Register to{" "}
          <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          disabled={loading} // Disable input when loading
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          disabled={loading} // Disable input when loading
        />

        {/* Password with Eye Icon */}
        <div className="relative w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full outline-none bg-transparent text-white placeholder-gray-300 px-[20px] pr-[50px] rounded-full text-[18px]"
            required
            disabled={loading} // Disable input when loading
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute right-[20px] text-[22px] text-white cursor-pointer"
              onClick={() => !loading && setShowPassword(false)} // Prevent action when loading
            />
          ) : (
            <IoEye
              className="absolute right-[20px] text-[22px] text-white cursor-pointer"
              onClick={() => !loading && setShowPassword(true)} // Prevent action when loading
            />
          )}
        </div>
        {error.length > 0 && <p className="text-red-500 text-[17px]">{error}</p>}

        {/* Sign Up Button */}
        <button
          type="submit"
          className="min-w-[150px] h-[60px] bg-white rounded-full font-semibold hover:bg-gray-200 transition-colors flex justify-center items-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Redirect to Sign In */}
        <p className="text-white text-[18px]">
          Already have an account?{" "}
          <span
            onClick={() => !loading && navigate("/signin")} // Prevent navigation when loading
            className="cursor-pointer text-blue-400 hover:underline"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;