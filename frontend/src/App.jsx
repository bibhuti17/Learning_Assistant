import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Customize from './pages/Customize.jsx'
import Customize2 from './pages/Customize2.jsx'
import { UserDataContext } from './context/UserContext.jsx'
import Home from './pages/Home.jsx'

const App = () => {
  const { userData } = useContext(UserDataContext)
  return (
    <Routes>
      <Route path="/" element={(userData?.user?.assistantImage && userData?.user?.assistantImage) ? <Home /> : <Navigate to={"/customize"}/>}  />
      <Route path="/signup" element={!userData?<SignUp /> : <Navigate to={"/"}/>} />
      <Route path="/signin" element={!userData?<SignIn /> : <Navigate to={"/"}/>} />
      <Route path="/customize" element={userData? <Customize /> : <Navigate to={"/signup"}/>} />
      <Route path="/customize2" element={userData? <Customize2 /> : <Navigate to={"/signup"}/>} />
    </Routes>
  )
}

export default App