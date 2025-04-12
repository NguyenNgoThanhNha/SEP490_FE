import { useEffect, useState, useRef } from "react";
import { Input, Button, Layout, Typography, List, Upload, Avatar } from "antd";
import { SendOutlined, PictureOutlined, SmileOutlined } from "@ant-design/icons";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  sendMessageToChannel,
  startConnection,
} from "@/services/signalRService";
import chatService from "@/services/chatService";
import { useChatStore } from "@/store/slice/chatSlice";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const ChatPage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((state) => state.messages);

  const currentUserId = useSelector((state: RootState) => state.auth.user?.userId);

  const {
    selectedChannel,
    setSelectedChannel,
    channels,
    setChannels,
    setMessages,
  } = useChatStore();



  useEffect(() => {
    const fetchChatData = async () => {
      try {
        if (!currentUserId) return;
        const customerRes = await chatService.getCustomerInfo({ userId: Number(currentUserId) });
        const fetchedCustomerId = customerRes?.result?.data?.id;
        if (!fetchedCustomerId) return;
        setCustomerId(fetchedCustomerId);
        await startConnection(fetchedCustomerId);
        const channelsRes = await chatService.getUserChannels({ customerId: fetchedCustomerId });
        setChannels(channelsRes?.result?.data || []);
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    fetchChatData();
  }, [currentUserId]);


  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel) return;
      try {
        const res = await chatService.getMessageChannels({ channelId: selectedChannel.id });
        setMessages(res?.result?.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedChannel]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSendMessage = async (fileUrl: string | null = null) => {
    if (!selectedChannel || (!newMessage.trim() && !fileUrl)) return;

    const messageType = fileUrl ? "image" : "text";
    const messageContent = fileUrl || newMessage;

    try {
      await sendMessageToChannel(
        selectedChannel.id,
        customerId?.toString() || '',
        messageContent,
        messageType
      );
   
      // const newMsg: Message = {
      //   senderId: currentUserId.toString(),
      //   content: messageContent,
      //   messageType: messageType,
      //   timestamp: new Date().toISOString(),
      //   channelId: selectedChannel.id.toString(),
      // };

      // useChatStore.getState().setMessages([
      //   ...useChatStore.getState().messages,
      //   newMsg
      // ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <Layout className="h-screen">
      <Sider
        width={320}
        className="bg-white border-r border-gray-200 flex flex-col max-h-screen"
      >
        <div className="p-4 shrink-0 bg-white">
          <Input.Search placeholder="Search..." className="mb-4" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <List
            dataSource={channels}
            itemLayout="horizontal"
            renderItem={(channel) => {
              const lastMessage = messages
                .filter((msg) => msg.channelId === channel.id.toString())
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
              return (
                <List.Item
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${selectedChannel?.id === channel.id
                    ? "bg-[#f0f0f0]"
                    : "hover:bg-[#f9f9f9]"
                    }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={`https://i.pravatar.cc/40?u=${channel.name}`} />}
                    title={<span className="font-medium">{channel.name}</span>}
                    description={
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {lastMessage
                          ? lastMessage.messageType === "image"
                            ? "[Image]"
                            : lastMessage.content
                          : "No messages yet"}
                      </div>
                    }
                  />
                  {lastMessage && (
                    <div className="text-xs text-gray-400 ml-2">
                      {moment(lastMessage.timestamp).format("hh:mm A")}
                    </div>
                  )}
                </List.Item>
              );
            }}
          />
        </div>
      </Sider>

      <Layout className="flex flex-col w-full">
        <Header className="bg-[#516D19] text-white text-lg font-semibold p-4 flex items-center justify-between">
          {selectedChannel ? selectedChannel.name : "Select a chat"}
          <Button type="text" icon={<SmileOutlined />} className="text-white" />
        </Header>

        <Content className="bg-gray-100 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {[...messages]
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((msg, index) => {
                const isSentByCurrentUser = msg.senderId === currentUserId;
                return (
                  <div key={index} className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                    {!isSentByCurrentUser && (
                      <Avatar
                        src={`https://i.pinimg.com/736x/02/56/11/02561183bde1e10a10bb2501df18e799.jpg`}
                        className="mr-2"
                      />
                    )}
                    <div
                      className={`p-3 rounded-xl shadow-md max-w-xs ${isSentByCurrentUser ? "bg-green-500 text-white" : "bg-white border border-gray-300"
                        }`}
                    >
                      {msg.messageType === "text" ? (
                        <Text>{msg.content}</Text>
                      ) : (
                        <img src={msg.content} alt="Sent media" className="w-40 h-auto rounded-lg" />
                      )}
                      <div className="text-xs text-gray-400 text-right mt-1">
                        {moment(msg.timestamp).format("hh:mm A")}
                      </div>
                    </div>
                  </div>
                );
              })}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t bg-white flex items-center">
            <div className="relative">
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-md z-50">
                  <EmojiPicker
                    onEmojiClick={(emoji) => {
                      setNewMessage((prev) => prev + emoji.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
              <Button icon={<SmileOutlined />} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mr-2" />
            </div>

            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = () => handleSendMessage(reader.result as string);
                reader.readAsDataURL(file);
                return false;
              }}
            >
              <Button icon={<PictureOutlined />} />
            </Upload>

            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mx-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <Button
              type="primary"
              className="bg-[#516D19]"
              icon={<SendOutlined />}
              onClick={() => handleSendMessage()}
            />
          </div>
        </Content>

      </Layout>
    </Layout>
  );
};

export default ChatPage;
