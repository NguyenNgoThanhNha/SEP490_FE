import * as signalR from '@microsoft/signalr'
import { addMessage, Message } from '@/store/slice/chatSlice.ts'
import store from '@/store'

const hubUrl = import.meta.env.VITE_SIGNALR_URL || 'http://localhost:5001/chat'

let connection: signalR.HubConnection | null = null

export const startConnection = async (userId: number) => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubUrl}?userId=${userId}`)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build()
    
    await connection.start()
    console.log('Connected to SignalR Hub')
    setupSignalRListeners()
  } catch (error) {
    console.error('Connection error:', error)
  }
}

const setupSignalRListeners = () => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    console.error('SignalR connection is not established.')
    return
  }
  connection.on('receiveChannelMessage', (message: Message) => {
    
    store.dispatch(addMessage(message))
    
    setTimeout(() => {
      const chatEnd = document.getElementById('chatEnd')
      chatEnd?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    // }
  })
}

export const sendMessageToChannel = async (
  channelId: string,
  senderId: string,
  content: string,
  messageType: string = 'text',
  fileUrl: string | null = null
) => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    console.error('SignalR connection is not established.');
    return;
  }
  
  try {
    await connection.invoke('SendMessageToChannel', channelId, senderId, content, messageType, fileUrl);
   
  } catch (error) {
    console.error(error);
    
  }
};


export const stopConnection = async () => {
  if (connection) {
    try {
      await connection.stop()
    } catch (error) {
      console.error('Error stopping SignalR connection:', error)
    }
  }
}

export const getConnection = () => connection
