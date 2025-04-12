import type { UploadProps } from 'antd'
import { Button, Image, Input, Upload } from 'antd'
import { CloseCircleOutlined, PictureOutlined, SendOutlined } from '@ant-design/icons'
import React, { useState } from 'react'

interface ChatInputProps {
  newMessage: string
  setNewMessage: (value: string) => void
  onSendMessage: (fileUrl?: string | null) => void
}

const ChatInput: React.FC<ChatInputProps> = ({
                                               newMessage,
                                               setNewMessage,
                                               onSendMessage
                                             }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    return false // Ngăn upload mặc định
  }
  
  const handleSend = () => {
    onSendMessage(previewImage)
    setPreviewImage(null) // Reset ảnh sau khi gửi
  }
  
  return (
    <div className="p-4 border-t bg-white flex flex-col gap-2">
      {/* Ảnh preview */}
      {previewImage && (
        <div className="relative w-fit">
          <Image
            src={previewImage}
            alt="Preview"
            width={100}
            height={100}
            style={{ borderRadius: 8 }}
            preview={false}
          />
          <CloseCircleOutlined
            className="absolute top-0 right-0 text-red-500 cursor-pointer"
            onClick={() => setPreviewImage(null)}
          />
        </div>
      )}
      
      <div className="flex items-center">
        <Upload showUploadList={false} beforeUpload={beforeUpload}>
          <Button icon={<PictureOutlined />} />
        </Upload>
        
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          className="flex-1 mx-2"
        />
        
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!newMessage && !previewImage}
        />
      </div>
    </div>
  )
}

export default ChatInput
