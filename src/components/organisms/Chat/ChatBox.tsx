import { useState } from "react";
import { Input, Button, List } from "antd";

type ChatBoxProps = {
  messages: { user: number; message: string }[];
  onSendMessage: (message: string) => void;
};

export const ChatBox = ({ messages, onSendMessage }: ChatBoxProps) => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <List
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <strong>{msg.user}: </strong> {msg.message}
          </List.Item>
        )}
      />
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
      <Button onClick={() => onSendMessage(message)}>Gửi</Button>
    </div>
  );
};
