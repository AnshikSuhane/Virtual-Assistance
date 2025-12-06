/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
import { UsersContext } from "../context/UserContext";

function Home() {
  const { userData, serverUrl, setuserData, getGeminiResponse } =
    useContext(UsersContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const [error, setError] = useState("");

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const restartTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const synth = window.speechSynthesis;

  // Check if user data is loaded
  if (!userData || !userData.assistantName) {
    return (
      <div className="w-full h-screen bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center overflow-hidden">
        <h1 className="text-white text-[20px]">Loading...</h1>
      </div>
    );
  }

  const handleLogOut = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setuserData(null);
      navigate("/signin");
    } catch (error) {
      setuserData(null);
      console.log(error);
      navigate("/signin");
    }
  };

  const startRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (
      !isSpeakingRef.current &&
      !isRecognizingRef.current &&
      isMountedRef.current
    ) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang === "en-US");
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      if (isMountedRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          startRecognition();
        }, 800);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      isSpeakingRef.current = false;
      setAiText("");

      if (isMountedRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          startRecognition();
        }, 800);
      }
    };

    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    if (!data || !data.response) return;

    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech Recognition is not supported in this browser. Please use Chrome or Edge."
      );
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    isMountedRef.current = true;

    // Wait for voices to load before greeting
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && isMountedRef.current) {
        const greeting = new SpeechSynthesisUtterance(
          `Hello ${userData.name}, what can I help you with?`
        );
        greeting.lang = "en-US";

        greeting.onend = () => {
          // Start recognition after greeting finishes
          if (isMountedRef.current) {
            setTimeout(() => {
              startRecognition();
            }, 500);
          }
        };

        window.speechSynthesis.speak(greeting);
      }
    };

    // Load voices
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition Started");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition Ended");

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      if (isMountedRef.current && !isSpeakingRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && !isSpeakingRef.current) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error("Restart error:", e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition Error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      // Don't restart on no-speech or aborted errors
      if (
        event.error !== "aborted" &&
        event.error !== "no-speech" &&
        isMountedRef.current &&
        !isSpeakingRef.current
      ) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && !isSpeakingRef.current) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error("Restart after error failed:", e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      // Check if wake word is detected (case insensitive)
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        console.log("Wake word detected!");
        setAiText("");
        setUserText(transcript);

        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }

        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        try {
          const data = await getGeminiResponse(transcript);

          if (data && data.response) {
            handleCommand(data);
            setAiText(data.response);
          } else {
            setAiText("Sorry, I couldn't process that request.");
            speak("Sorry, I couldn't process that request.");
          }
        } catch (error) {
          console.error("Error getting response:", error);
          setAiText("Sorry, something went wrong.");
          speak("Sorry, something went wrong.");
        } finally {
          setUserText("");
        }
      }
    };

    return () => {
      isMountedRef.current = false;

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log("Recognition already stopped");
        }
      }

      window.speechSynthesis.cancel();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData.name, userData.assistantName, getGeminiResponse]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden px-5">
      {/* Mobile Menu Icon */}
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer hover:scale-110 transition-transform z-10"
        onClick={() => setHam(true)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed lg:hidden top-0 left-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform z-50`}
      >
        <RxCross1
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer hover:scale-110 transition-transform"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] hover:bg-gray-200 transition-colors"
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hover:bg-gray-200 transition-colors"
          onClick={() => {
            navigate("/customize");
            setHam(false);
          }}
        >
          Customize your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div
          className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col items-start
        "
        >
          {userData.history ? (
            userData.history.map((his, index) => {
              return (
                <span
                  key={index}
                  className="text-gray-200 truncate text-[20px] overflow-y-auto"
                >
                  {his}
                </span>
              );
            })
          ) : (
            <div className="text-white">No history found</div>
          )}
        </div>
      </div>

      {/* Desktop Buttons */}
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px] hover:bg-gray-200 transition-colors z-10"
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block hover:bg-gray-200 transition-colors z-10"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      {/* Error Display */}
      {error && (
        <div className="absolute top-[20px] left-[20px] bg-red-500 text-white p-[15px] rounded-lg max-w-[300px] z-20">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center gap-[15px] h-full w-full">
        {/* Assistant Image */}
        <div className="w-[250px] h-[350px] sm:w-[300px] sm:h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={userData?.assistantImage}
            alt="Assistant"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Assistant Name */}
        <h1 className="text-white text-[16px] sm:text-[18px] font-semibold">
          I'm {userData?.assistantName}
        </h1>

        {/* Status Indicator */}
        {listening && !aiText && !userText && (
          <div className="text-green-400 text-[14px] sm:text-[16px] font-semibold animate-pulse">
            Listening...
          </div>
        )}

        {/* User/AI Image */}
        {!aiText && (
          <img src={userImg} alt="User" className="w-[150px] sm:w-[200px]" />
        )}
        {aiText && (
          <img src={aiImg} alt="AI" className="w-[150px] sm:w-[200px]" />
        )}

        {/* Text Display */}
        <h1 className="text-white text-[16px] sm:text-[18px] font-semibold text-center max-w-[90%] sm:max-w-[800px] break-words">
          {userText ? userText : aiText ? aiText : null}
        </h1>
      </div>
    </div>
  );
}

export default Home;
