import React, { useState, useEffect } from "react";
import "./chatbot.css";
import send from "../assets/send.png";
import ai from "../assets/ai.png";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = ({ BotTrigger, userData }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(userData?.name || "");
  const genAI = new GoogleGenerativeAI(
    "AIzaSyA39LrrBJ49c4AAB2ZOCSZNGE9BfiD4Cp0"
  );

  useEffect(() => {
    if (userName) {
      setMessages([
        { text: `Hi ${userName}, how can I assist you today?`, type: "bot" },
      ]);
    } else {
      setMessages([{ text: "Hey, could you tell me your name?", type: "bot" }]);
    }
  }, [userName]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { text: inputValue, type: "user" }];
    setMessages(newMessages);
    setInputValue("");

    if (!userName) {
      setUserName(inputValue);
      setMessages([
        ...newMessages,
        { text: `Nice to meet you, ${inputValue}!`, type: "bot" },
      ]);
    } else {
      try {
        setLoading(true);

        // Construct the prompt using available user data
        const prompt = `
          User: ${userData?.name || "Unknown"}\n
          Age: ${userData?.age || "N/A"}\n
          Gender: ${userData?.gender || "N/A"}\n
          Bloodgroup: ${userData?.bloodgroup || "N/A"}\n
          Height: ${userData?.height || "N/A"}\n
          Weight: ${userData?.weight || "N/A"}\n
          Email: ${userData?.email || "N/A"}\n
          Query: ${inputValue}\n
          Response:`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        setMessages([...newMessages, { text: response, type: "bot" }]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages([
          ...newMessages,
          { text: "Something went wrong. Please try again.", type: "bot" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="overlay-chat">
      <div className="main-chat-div">
        <div className="head-div">
          <img src={ai} alt="AI Assistant" width={40} height={40} />
          <h2>AI Assist</h2>
          <button className="close-chat-btn" onClick={BotTrigger}>
            &times;
          </button>
        </div>

        <div className="chat-content">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.text}
            </div>
          ))}
          {loading && <div className="loading">...</div>}
        </div>

        <div className="chat-bot-input">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Hey, any queries?"
          />
          <button id="chatbtn" onClick={handleSend}>
            <img src={send} alt="Send" width={30} height={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
