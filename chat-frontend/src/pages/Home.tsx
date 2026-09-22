import { useState } from "react";
import "./home.css";

const Home = () => {
  const [chats, setChats] = useState(["New Message"]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    setChats([...chats, inputMessage]);
    setInputMessage("");
  };
  return (
    <>
      <h1>Welcome</h1>
      <div className="chat">
        <div className="chat-form">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
              placeholder="Type a message...."
            />
            <input type="submit" />
          </form>
        </div>
        <div className="chat-disp">
          {chats.map((message, index) => (
            <li key={index}> {message} </li>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
