import { useChat } from "@/context/ChatContext";
import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

const ChatBox = ({ senderId }) => {
  const { messages, sendChatMessage } = useChat();
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendChatMessage(senderId, message);
      setMessage("");
    }
  };

  return (
    <div className="w-96 bg-white border rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-t-lg">
        Messenger Chat
      </div>

      <div className="h-80 overflow-y-auto p-3 flex flex-col space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] p-2 px-4 text-sm rounded-2xl ${
                msg.senderId === senderId
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t p-2 flex items-center">
        <input
          type="text"
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-full px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="ml-2 text-blue-500 hover:text-blue-600">
          <SendHorizonal size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
