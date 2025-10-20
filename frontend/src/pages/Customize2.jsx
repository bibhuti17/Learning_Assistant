import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { MdArrowBack } from "react-icons/md"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const { serverUrl, userData, backendImage, selectedImage, setUserData } = useContext(UserDataContext)
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        try {
            setLoading(true)
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })

            console.log(result.data)
            setUserData(result.data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030377] flex justify-center items-center flex-col  p-[20px] relative'>
            <MdArrowBack className='absolute top-[30px] left-[30px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={() => navigate ("/customize")} />
            <h1 className='text-[white] text-[30px] text-center mb-[30px]'> Enter Your <span className='text-blue-200'>Assistant Name !</span></h1>
            <input type="text" placeholder='Hii Leo here ! ' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />

            {assistantName && <button className='min-w-[200px] h-[60px] mt-[30px] rounded-full text-black font-semibold text-[19px] bg-white cursor-pointer hover:scale-105 duration-300 ' disabled={loading} onClick={async () => {
                await handleUpdateAssistant()
                navigate ("/")
            }} >
                {loading ? "Loading..." : "Go to Assistant"}
            </button>}
        </div>
    );
};

export default Customize2