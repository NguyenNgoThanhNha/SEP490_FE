import { sendMessageToChannel, startConnection } from "@/services/signalRService";
import { useEffect, useState, useRef } from "react";
import { Input, Button, Layout, Typography, List} from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const ChatPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "67de59a9407fcc4dc71183ab";

  useEffect(() => {
    fetch("https://solaceapi.ddnsking.com/api/Hub/channel/67e52aa8143ee9e921d3b5a9")
      .then((res) => res.json())
      .then((data) => {
        setSelectedChannel(data.result);
        setMessages(data.result.messages || []);
      })
      .catch((err) => console.error(err));

    startConnection();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedChannel || !newMessage.trim()) return;
    try {
      await sendMessageToChannel(selectedChannel.id, currentUserId, newMessage, "text");
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: currentUserId, content: newMessage, messageType: "text" },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Layout className="h-screen">
      <Sider width={250} className="bg-white p-4 border-r border-gray-200">
        <Text strong className="text-lg block mb-4">
          Channels
        </Text>
        <List
          dataSource={["General", "Support"]}
          renderItem={(channel) => (
            <List.Item className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition">
              {`# ${channel}`}
            </List.Item>
          )}
        />
      </Sider>
      <Layout className="w-full">
        <Header className="bg-blue-600 text-white text-lg font-semibold p-4 flex items-center">
          {selectedChannel ? selectedChannel.name : "Select a channel"}
        </Header>
        <Content className="p-6 bg-gray-100 overflow-y-auto flex-1 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 max-w-lg rounded-lg text-sm shadow-md ${msg.senderId === currentUserId ? "bg-blue-500 text-white" : "bg-white border border-gray-300"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </Content>
        <div className="p-4 border-t bg-white flex items-center">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            className="ml-2"
            onClick={handleSendMessage}
          />
        </div>
      </Layout>
    </Layout>
  );
};

export default ChatPage;