import { sendMessageToChannel, startConnection } from "@/services/signalRService";
import { useEffect, useState, useRef } from "react";
import { Input, Button, Layout, Typography, List, Upload, Avatar } from "antd";
import { SendOutlined, PictureOutlined, SmileOutlined } from "@ant-design/icons";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const ChatPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "67de59a9407fcc4dc71183ab";

  useEffect(() => {
    fetch("https://solaceapi.ddnsking.com/api/Hub/channel-messages/67e52aa8143ee9e921d3b5a9")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.result) {
          setSelectedChannel(data.result);
          setMessages(data.result || []);
        }
      })
      .catch((err) => console.error(err));

    startConnection();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (fileUrl = null) => {
    if (!selectedChannel || (!newMessage.trim() && !fileUrl)) return;
    const messageType = fileUrl ? "image" : "text";
    const messageContent = fileUrl || newMessage;

    try {
      await sendMessageToChannel(
        selectedChannel.id,
        currentUserId,
        messageContent,
        messageType
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: currentUserId, content: messageContent, messageType, timestamp: new Date().toISOString() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Layout className="h-screen">
      <Sider width={320} className="bg-white p-4 border-r border-gray-200 flex flex-col">
        <Input.Search placeholder="Search..." className="mb-4" />
        <List
          dataSource={["General", "Support", "Friends"]}
          renderItem={(channel) => (
            <List.Item
              className="p-3 flex items-center bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => setSelectedChannel({ name: channel })}
            >
              <Avatar src={`https://i.pravatar.cc/40?u=${channel}`} className="mr-3" />
              <Text>{channel}</Text>
            </List.Item>
          )}
        />
      </Sider>

      <Layout className="flex flex-col w-full">
        <Header className="bg-[#516D19] text-white text-lg font-semibold p-4 flex items-center justify-between">
          {selectedChannel ? selectedChannel.name : "Select a chat"}
          <Button type="text" icon={<SmileOutlined />} className="text-white" />
        </Header>

        <Content className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          {messages.map((msg, index) => {
            const isSentByCurrentUser = msg.senderId === currentUserId;
            return (
              <div key={index} className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
                {!isSentByCurrentUser && (
                  <Avatar src={`https://i.pinimg.com/736x/02/56/11/02561183bde1e10a10bb2501df18e799.jpg`} className="mr-2" />
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
        </Content>
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
            <Button
              icon={<SmileOutlined />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-2"
            />
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
          />
          <Button type="primary" className="bg-[#516D19]" icon={<SendOutlined />} onClick={() => handleSendMessage()} />
        </div>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
