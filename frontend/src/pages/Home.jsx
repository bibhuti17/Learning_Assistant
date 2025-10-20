import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiGif from '../assets/ai.gif'
import userGif from '../assets/user.gif'
import { BiMenuAltRight } from "react-icons/bi"
import { RxCross1 } from "react-icons/rx"


const Home = () => {
  let navigate = useNavigate()
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext)
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false)
  const isRecognizingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)

  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
      return result.data
    } catch (error) {
      setUserData(null)
      console.log(error)
    } 
  }

  const startRegcognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        setListening(true)
      } catch (error) {
        if (!error.message.includes("start")) {
          console.log("Recognition error:", error)
        }
      }
    }
  }

  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN'
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) {
      utterence.voice = hindiVoice
    }

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRegcognition() //delay to avoid race conditon
      }, 800)
    }
    synth.cancel() //pehlel sae koi speak ko bandh kar dega
    synth.speak(utterence)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    if (type == 'google_search') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }

    if (type == 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }

    if (type == 'instagram_search') {
      window.open(`https://www.instagram.com/`, '_blank')
    }

    if (type == 'facebook_search') {
      window.open(`https://www.facebook.com/`, '_blank')
    }

    if (type == 'weather_open') {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }

    if (type == 'youtube_search' || type == 'youtube_play') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.lang = 'en-IN'
    recognition.interimResults = false

    recognitionRef.current = recognition

    let isMounted = true //flag to avoid set state on unmounted component

    // start recognition after 1sec delay if  component is mounted

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log("Recognition requested to start.")
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log("Start error : ", error)
          }
        }
      }
    }, 1000)

    recognition.onstart = () => {
      console.log("Recognition started")
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      console.log("Recognition ended")
      isRecognizingRef.current = false
      setListening(false)
      if (isMounted && isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recogniton restarted.")
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error)
              }
            }
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error)
      isRecognizingRef.current = false
      setListening(false)
      if (event.error !== 'aborted' && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
              console.log("Recognition restarted after error.")
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error)
              }
            }
          }
        }, 1000)
      }
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log("heard :" + transcript)
      if (transcript.toLowerCase().includes(userData.user.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    window.speechSynthesis.onvoiceschanged = () => {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.user.name}, what can I help you with ?`)
      greeting.lang = 'hi-IN'
      greeting.onend = () => {
        startTimeout()
      }
      window.speechSynthesis.speak(greeting)
    }

    return () => {
      isMounted = false
      clearTimeout(startTimeout)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
    }

  }, [])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#010147] flex justify-center items-center flex-col gap-[20px] overflow-hidden'>

      <BiMenuAltRight className='lg:hidden text-[white] absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(true)} />
      <div className={`lg:hidden absolute top-0 w-full h-full bg-[#0000004e] backdrop-blur-lg p-[20px] flex flex-col items-start gap-[20px] ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className='text-[white] absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(false)} />
        <button className='min-w-[150px] h-[60px]  rounded-full text-black font-semibold text-[19px] bg-white cursor-pointer hover:scale-105 duration-300' type='submit' onClick={handleLogOut}>
          Log Out
        </button>
        <button className='min-w-[150px] h-[60px]  rounded-full text-black font-semibold text-[19px] bg-white cursor-pointer hover:scale-105 duration-300 px-[20px] py-[10px]' onClick={() => navigate("/customize")} type='submit' >
          Customize your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col'>
          {userData.user.history?.map((history) => (
            <span className='text-gray-400 text-[18px] mt-[20px]'>{history}</span>
          ))}
        </div>
      </div>

      <button className='min-w-[150px] h-[60px] mt-[30px] rounded-full text-black font-semibold text-[19px] bg-white cursor-pointer hover:scale-105 duration-300 absolute hidden lg:block top-[20px] right-[20px]' type='submit' onClick={handleLogOut}>
        Log Out
      </button>
      <button className='min-w-[150px] h-[60px] mt-[30px] rounded-full text-black font-semibold text-[19px] bg-white cursor-pointer hover:scale-105 duration-300 absolute hidden lg:block top-[100px] right-[20px] px-[20px] py-[10px]' onClick={() => navigate("/customize")} type='submit' >
        Customize your Assistant
      </button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden'>
        <img src={userData?.user?.assistantImage} alt="assistant Image" className='h-full object-cover rounded-4xl' />
      </div>
      <h1 className='text-[white] font-semibold text-[24px]'>I'm {userData?.user?.assistantName}</h1>
      {!aiText && <img src={userGif} alt="gif" className='w-[200px]' />}
      {aiText && <img src={aiGif} alt="gif" className='w-[200px]' />}
      <h1 className='text-[white] text-[18px] font-semibold text-wrap' >{userText ? userText : aiText ? aiText : null}</h1>
    </div>
  );
};

export default Home;