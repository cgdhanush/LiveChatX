import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./home.css";
import Navbar from "../components/Navbar";

type Chat = {
  _id?: string;
  text: string;
};

const Home = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Socket.IO with JWT
    const socket = io("http://localhost:3000", {
      auth: {
        token,
      },
    });

    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/message", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          }

          throw new Error("Failed to fetch messages");
        }

        const data: Chat[] = await res.json();
        setChats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket authentication error:", error.message);
    });

    socket.on("new-message", (message: Chat) => {
      setChats((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new-message");
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = inputMessage.trim();

    if (!text) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        throw new Error("Failed to send message");
      }

      const newMessage: Chat = await res.json();

      setChats((prev) => [...prev, newMessage]);
      setInputMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <h1>Welcome</h1>

      <div className="chat">
        <div className="chat-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message...."
            />

            <input type="submit" value="Send" />
          </form>
        </div>

        <div className="chat-disp">
          {chats.map((message, index) => (
            <li key={message._id ?? index}>{message.text}</li>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
