import { startConnection } from "@/services/signalRService";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);

  useEffect(() => {
    startConnection();
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch("https://solaceapix.ddnsking.com/api/MongoDb/channels");
      const data = await response.json();
      setChannels(data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const joinChatRoom = async (channelId) => {
    setCurrentChannel(channelId);
    await fetchMessages(channelId);
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await fetch(`https://solaceapix.ddnsking.com/api/Hub/get-messages/${channelId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendChatMessage = async (senderId, content) => {
    if (!currentChannel) return;
    await sendMessage(currentChannel, senderId, content);
  };

  useEffect(() => {
    onReceiveMessage((newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);

  return (
    <ChatContext.Provider value={{ channels, messages, sendChatMessage, joinChatRoom }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
