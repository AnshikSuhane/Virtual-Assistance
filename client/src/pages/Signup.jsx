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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    seterror("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setuserData(result.data);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setuserData(null);
      seterror(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover bg-center px-4 sm:px-6"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignup}
        className="
          w-full 
          max-w-[500px] 
          bg-black/20 
          backdrop-blur 
          shadow-black 
          flex flex-col 
          items-center 
          justify-center 
          gap-5 
          px-6 
          py-10 
          rounded-xl
        "
      >
        <h1 className="text-white text-2xl sm:text-3xl font-semibold text-center leading-tight">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full 
            h-14 
            outline-none 
            border-2 
            border-white 
            bg-transparent 
            text-white 
            placeholder-gray-300 
            px-5 
            rounded-full 
            text-base 
            sm:text-lg
          "
          required
          disabled={loading}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full 
            h-14 
            outline-none 
            border-2 
            border-white 
            bg-transparent 
            text-white 
            placeholder-gray-300 
            px-5 
            rounded-full 
            text-base 
            sm:text-lg
          "
          required
          disabled={loading}
        />

        {/* Password */}
        <div
          className="
            relative 
            w-full 
            h-14 
            border-2 
            border-white 
            bg-transparent 
            text-white 
            rounded-full 
            flex 
            items-center
          "
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full 
              h-full 
              outline-none 
              bg-transparent 
              text-white 
              placeholder-gray-300 
              px-5 
              pr-12 
              rounded-full 
              text-base 
              sm:text-lg
            "
            required
            disabled={loading}
          />

          {showPassword ? (
            <IoEyeOff
              className="absolute right-4 text-xl text-white cursor-pointer"
              onClick={() => !loading && setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute right-4 text-xl text-white cursor-pointer"
              onClick={() => !loading && setShowPassword(true)}
            />
          )}
        </div>

        {error.length > 0 && (
          <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="
            min-w-[140px] 
            h-14 
            bg-white 
            rounded-full 
            font-semibold 
            hover:bg-gray-200 
            transition-colors 
            flex 
            justify-center 
            items-center
            text-base
            sm:text-lg
          "
          disabled={loading}
        >
          {loading ? (
            <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-white text-base sm:text-lg text-center">
          Already have an account?{" "}
          <span
            onClick={() => !loading && navigate("/signin")}
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
