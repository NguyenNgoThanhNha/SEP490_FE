import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import ChatBox from "@/components/organisms/Chat/ChatBox";

const ChatPage = () => {
  const { channels, joinChatRoom } = useChat();
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleSelectChannel = (channelId) => {
    setSelectedChannel(channelId);
    joinChatRoom(channelId);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Messenger Chat</h1>
      
      <div className="w-96 border p-2 rounded">
        <h2 className="font-semibold mb-2">Channels</h2>
        {channels.length === 0 ? (
          <p className="text-gray-500">No channels available</p>
        ) : (
          channels.map((channel) => (
            <button
              key={channel.id}
              className="w-full text-left p-2 bg-gray-200 hover:bg-gray-300 rounded mb-1"
              onClick={() => handleSelectChannel(channel.id)}
            >
              {channel.name}
            </button>
          ))
        )}
      </div>

      {selectedChannel && <ChatBox senderId={1} />}
    </div>
  );
};

export default ChatPage;
