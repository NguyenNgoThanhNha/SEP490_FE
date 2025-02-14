import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import chatService from "@/services/chatService";

interface Message {
  text: string | JSX.Element;
  sender: "user" | "bot";
}

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  const formatBotMessage = (data: string): JSX.Element[] => {
    const items = data.split("\n\n").filter((item) => item.trim() !== ""); // Split into sections
    return items.map((item, index) => (
      <div key={index} className="mb-4">
        {item.split("\n").map((line, lineIndex) => (
          <p
            key={lineIndex}
            className={`${
              line.startsWith("**") ? "font-bold" : "text-sm"
            }`}
          >
            {line.replace(/\*\*/g, "")}
          </p>
        ))}
      </div>
    ));
  };

  const handleSend = async (): Promise<void> => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        setIsSending(true);
        setIsTyping(true);
        const response = await chatService.chatSend({ message: input });
        const botResponse =
          response?.result?.data || "I'm sorry, something went wrong.";
        const formattedMessage = formatBotMessage(botResponse);

        const botMessage: Message = { text: formattedMessage, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch {
        const errorMessage: Message = {
          text: "Failed to get a response. Please try again later.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsSending(false);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-96 h-[600px] bg-[#F5F5DC] rounded-2xl shadow-lg flex flex-col overflow-hidden mb-3">
          <div className="bg-[#6D9801] text-white px-4 py-3 flex items-center justify-between">
            <h4 className="text-lg font-semibold">Solacer</h4>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-300 focus:outline-none bg-transparent"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto bg-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-[#6D9801] text-white"
                      : "bg-gray-300 text-black"
                  } max-w-[70%] px-4 py-2 rounded-2xl`}
                >
                  {typeof message.text === "string" ? (
                    message.text
                  ) : (
                    message.text 
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white px-4 py-2 flex items-center border-t border-gray-300">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              className={`ml-2 bg-[#6D9801] text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none ${
                isSending && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isSending}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="bg-[#6D9801] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default ChatPopup;
