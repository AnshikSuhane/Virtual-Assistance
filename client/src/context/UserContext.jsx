/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import axios from "axios"
export const UsersContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData,setuserData]=useState(null)
  const [frontendImage,setFrontendImage]=useState(null)
  const [backendImage,setbackendImage]=useState(null)
  const [selectedImage,setSelectedImage]=useState(null)

  
  const handleCurrentUser=async()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setuserData(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getGeminiResponse=async(command)=>{
    try {
       const result=await axios.post(`${serverUrl}/api/gemini/chat`,{command},{withCredentials:true})
       return result.data
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(()=>{
    handleCurrentUser()
  },[])
  const value = {
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    backendImage,
    selectedImage,
    setFrontendImage,
    setSelectedImage,
    setbackendImage,
    getGeminiResponse
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export default UserContext;
