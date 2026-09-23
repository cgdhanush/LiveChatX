import { useEffect, useState } from "react";
import "./home.css";

type Chat = {
  text: string;
};

const Home = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("http://localhost:3000/api/messages");
      const data = await res.json();
      setChats(data);
    };
    fetchChats();
  }, []);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputMessage.trim();

    const sendChat = async () => {
      const res = await fetch("http://localhost:3000/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        console.log("Failed to send message");
        return;
      }
      const newMessage: Chat = await res.json();
      setChats((prev) => [...prev, newMessage]);
      setInputMessage("");
    };

    sendChat();
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
            <li key={index}> {message.text} </li>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
