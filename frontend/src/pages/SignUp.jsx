import React, { useState, useContext } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5"
import { IoEyeOff } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext.jsx'



const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { serverUrl,userData, setUserData } = useContext(UserDataContext)
  const navigate = useNavigate()

  // to store 
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // show backend error on frontend
  const [error, setError] = useState("")
  // loding state
  const [loading, setLoading] = useState(false)
  // api fetch
  const handleSignUP = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      // console.log({ name, email, password, serverUrl })
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name,
        email,
        password
      }, { withCredentials: true })
      setUserData(result.data)
      setLoading(false)
      navigate("/customize")
    } catch (error) {
      // if (
      //   error.response &&
      //   error.response.data &&
      //   error.response.data.message
      // ) {
      //   alert(error.response.data.message); // See backend validation error
      // }
      setUserData(null)
      console.log(error)
      setLoading(false)
      setError(error.response.data.message)
    }
  }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }} >

      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000028] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignUP}>

        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to
          <span className='text-blue-200'>Virtual Assistant</span>
        </h1>

        <input type="text" placeholder='Enter your name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e) => setName(e.target.value)} value={name} />

        <input type="email" placeholder='Enter your email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email} />

        <div className='w-full h-[60px] border-2 border-white bg-transparent rounded-full text-[18px] text-white relative'>
          <input type={showPassword ? "text" : "password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-grey-300 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password} />

          {!showPassword && <IoEye className='absolute w-[25px] h-[25px] top-[18px] right-[20px] text-white cursor-pointer' onClick={() => setShowPassword(true)} />}
          {showPassword && <IoEyeOff className='absolute w-[25px] h-[25px] top-[18px] right-[20px] text-white cursor-pointer' onClick={() => setShowPassword(false)} />}

        </div>

        {error.length > 0 && <p className='text-red-500 text-[16px]'>*{error}</p>}

        <button className='min-w-[150px] h-[60px] mt-[30px] rounded-full text-black font-semibold text-[19px] bg-white cursor-pointer hover:scale-105 duration-300' type='submit' disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signin")}>Already have an account ?
          <span className='text-blue-400 text-[18px]'>
            Sign in
          </span>
        </p>
      </form>
    </div>
  )
}

export default SignUp