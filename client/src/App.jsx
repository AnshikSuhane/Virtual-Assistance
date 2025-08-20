/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Home from './pages/Home'
import { UsersContext } from './context/UserContext'

const App = () => {
  const {userData,setuserData} = useContext(UsersContext)
  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage && userData?.assistantName)? <Home/> : <Navigate to={"/customize"}/>} />
      <Route path="/signup" element={!userData?<Signup/>: <Navigate to={"/"}/>} />
      <Route path="/signin" element={!userData?<SignIn/>: <Navigate to={"/"}/>} />
      <Route path="/customize" element={userData?<Customize/>: <Navigate to={"/signin"}/>} />
    </Routes>
  )
}

export default App