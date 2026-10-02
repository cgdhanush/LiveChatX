import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

type ChatMessage = {
  _id?: string;
  text: string;
};

const Chat = () => {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const socket = io("http://localhost:3000", {
      auth: {
        token,
      },
    });

    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/message", {
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

        const data: ChatMessage[] = await res.json();
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

    socket.on("new-message", (message: ChatMessage) => {
      setChats((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("new-message");
      socket.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = inputMessage.trim();

    if (!text) return;

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

      const newMessage: ChatMessage = await res.json();

      setChats((prev) => [...prev, newMessage]);
      setInputMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
};

export default Chat;
