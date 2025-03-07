import { useState } from "react";
import { Layout } from "antd";
import { ChatList } from "@/components/organisms/Chat/ChatList";
import { ChatBox } from "@/components/organisms/Chat/ChatBox";
import { ChatHub } from "./CreateHub";

const { Sider, Content } = Layout;

export const ChatPage = () => {
  const [userId] = useState(2);
  const [messages, setMessages] = useState<Record<number, { user: number; message: string }[]>>({});
  const [unreadMessages, setUnreadMessages] = useState<Record<number, number>>({});
  const [activeUser, setActiveUser] = useState<number | null>(null);

  const handleReceiveMessage = (fromUserId: number, msg: string) => {
    setMessages((prev) => ({
      ...prev,
      [fromUserId]: [...(prev[fromUserId] || []), { user: fromUserId, message: msg }],
    }));
    if (fromUserId !== activeUser) {
      setUnreadMessages((prev) => ({ ...prev, [fromUserId]: (prev[fromUserId] || 0) + 1 }));
    }
  };

  const sendMessage = (message: string) => {
    if (activeUser && message.trim() !== "") {
      setMessages((prev) => ({
        ...prev,
        [activeUser]: [...(prev[activeUser] || []), { user: userId, message }],
      }));
      setUnreadMessages((prev) => ({ ...prev, [activeUser]: 0 }));
    }
  };

  return (
    <Layout>
      <Sider width={250}>
        <ChatList onSelectUser={setActiveUser} unreadMessages={unreadMessages} />
      </Sider>
      <Content>
        {activeUser ? (
          <ChatBox messages={messages[activeUser] || []} onSendMessage={sendMessage} />
        ) : (
          <div>Chọn một người để trò chuyện</div>
        )}
      </Content>
      <ChatHub userId={userId} onReceiveMessage={handleReceiveMessage} />
    </Layout>
  );
};
