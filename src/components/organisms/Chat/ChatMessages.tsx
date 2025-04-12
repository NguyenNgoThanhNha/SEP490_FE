import { Message } from '@/store/slice/chatSlice.ts'

interface Props {
  messages: Message[];
  currentUserId: string | null;
}

export default function ChatMessages({ messages, currentUserId }: Props) {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime()
  )
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {sortedMessages.map((msg, index) => {
        const isCurrentUser = msg.sender === currentUserId?.toString()
        console.log(msg,currentUserId?.toString())
        return (
          <div
            key={msg.id || index}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded break-words ${
                isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-70 text-right">
                {new Date(msg.timestamp!).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
