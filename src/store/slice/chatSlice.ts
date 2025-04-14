import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  senderCustomer: {
    id: string
    email: string
    password: string
    fullName: string
    userId: number
    image: string
  }
  id?: string
  channelId: string
  sender: string
  content: string
  messageType: string
  timestamp?: string
}

interface Channel {
  unreadCount: number
  lastMessage: string
  id: string
  name: string
}

interface ChatState {
  selectedChannel: Channel | null
  channels: Channel[]
  messages: Message[]
}

const initialState: ChatState = {
  selectedChannel: null,
  channels: [],
  messages: []
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChannel: (state, action: PayloadAction<Channel>) => {
      state.selectedChannel = action.payload
    },
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    }
  }
})

export const { setSelectedChannel, setChannels, setMessages, addMessage } = chatSlice.actions

export default chatSlice.reducer
