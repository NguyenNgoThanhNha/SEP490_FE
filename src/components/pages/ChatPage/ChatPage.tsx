import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setChannels, setMessages } from '@/store/slice/chatSlice'
import chatService from '@/services/chatService.ts'
import { sendMessageToChannel, startConnection } from '@/services/signalRService.ts'
import ChatInput from '@/components/organisms/Chat/ChatInput.tsx'
import ChatSidebar from '@/components/organisms/Chat/ChatSidebar.tsx'
import ChatMessages from '@/components/organisms/Chat/ChatMessages.tsx'
import { ChatHeader } from '@/components/organisms/Chat/ChatHeader'

export default function ChatPage() {
  const dispatch = useDispatch()
  const selectedChannel = useSelector(
    (state: RootState) => state.chat.selectedChannel
  )
  const currentUserId = useSelector((state: RootState) => state.auth.user?.userId)
  const messages = useSelector((state: RootState) => state.chat.messages)
  const [newMessage, setNewMessage] = useState('')
  const [customerId, setCustomerId] = useState('')
  
  const fetchData = useCallback(async () => {
    if (!currentUserId) return
    
    const res = await chatService.getCustomerInfo({ userId: (currentUserId) })
    const customerId = res?.result?.data?.id
    if (!customerId) return
    setCustomerId(customerId)
    await startConnection(customerId)
    
    const channelsRes = await chatService.getUserChannels({ customerId })
    dispatch(setChannels(channelsRes?.result?.data || []))
  }, [currentUserId])
  
  const handleSendMessage = async (fileUrl: string | null = null) => {
    if (!selectedChannel || (!newMessage.trim() && !fileUrl)) return
    
    const content = newMessage;
    const messageType = 'text';
    
    try {
      await sendMessageToChannel(
        selectedChannel.id.toString(),
        customerId,
        content,
        messageType
      )
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel?.id) return
      const res = await chatService.getMessageChannels({
        channelId: selectedChannel.id
      })
      dispatch(setMessages(res?.result?.data || []))
    }
    
    fetchMessages()
  }, [selectedChannel])
  
  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-lg overflow-hidden">
      <ChatSidebar />
      <div className="flex flex-col flex-1">
        <ChatHeader/>
        <ChatMessages messages={messages} currentUserId={customerId} />
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      
      </div>
    </div>
  )
}