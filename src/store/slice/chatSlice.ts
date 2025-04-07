import { create } from 'zustand';

interface Message {
  id?: string;
  channelId: string;
  senderId: string;
  content: string;
  messageType: string;
  timestamp?: string;
}

interface Channel {
  id: string;
  name: string;
}

interface ChatState {
  selectedChannel: Channel | null;
  channels: Channel[];
  messages: Message[];

  setSelectedChannel: (channel: Channel) => void;
  setChannels: (channels: Channel[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedChannel: null,
  channels: [],
  messages: [],

  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setChannels: (channels) => set({ channels }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
}));
