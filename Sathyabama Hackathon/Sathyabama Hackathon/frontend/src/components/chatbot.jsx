import "./chatbot.css";
import send from "../assets/send.png";
import ai from "../assets/ai.png";

const Chat = ({BotTrigger}) => {
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
        </div>
        <div className="chat-bot-input">
          <input type="text" placeholder="Hey, any queries?" />
          <button id="chatbtn">
            <img src={send} alt="Send" width={30} height={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
