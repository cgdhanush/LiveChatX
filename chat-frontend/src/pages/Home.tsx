import { useEffect, useState } from "react";
import "./home.css";

const Home = () => {
  const [chats, setChats] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("http://localhost:3000/messages");
      const data = await res.json();
      setChats(data);
    };
    fetchChats();
  }, []);

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
