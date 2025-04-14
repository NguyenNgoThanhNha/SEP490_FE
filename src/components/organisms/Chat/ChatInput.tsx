import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="relative p-4 border-t bg-white flex flex-col gap-2">
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 bg-white shadow-lg rounded-md z-50">
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setNewMessage(newMessage + emoji.emoji);
              setShowEmojiPicker(false);
            }}
          />

        </div>
      )}
      <div className="flex items-center">
        <Button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="mx-2"
        >
          🙂
        </Button>

        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 mx-2"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className='bg-[#516d19]'
        />
      </div>
    </div>
  );
};

export default ChatInput;
