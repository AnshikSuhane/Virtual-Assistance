/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import axios from "axios"
export const UsersContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData,setuserData]=useState(null)
  const handleCurrentUser=async()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setuserData(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleCurrentUser()
  },[])
  const value = {
    serverUrl,
    userData,
    setuserData
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export default UserContext;
