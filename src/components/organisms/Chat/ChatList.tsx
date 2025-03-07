import { useState, useEffect } from "react";
import { Avatar, Badge, List } from "antd";
import axios from "axios";

type ChatListProps = {
  onSelectUser: (userId: number) => void;
  unreadMessages: Record<number, number>;
};

export const ChatList = ({ onSelectUser, unreadMessages }: ChatListProps) => {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axios
      .get("https://solaceapi.ddnsking.com/api/chat/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("❌ Error fetching users:", error));
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={users}
      renderItem={(user) => (
        <List.Item onClick={() => onSelectUser(user.id)}>
          <List.Item.Meta
            avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
            title={
              <Badge count={unreadMessages[user.id] || 0}>
                {user.name}
              </Badge>
            }
          />
        </List.Item>
      )}
    />
  );
};
