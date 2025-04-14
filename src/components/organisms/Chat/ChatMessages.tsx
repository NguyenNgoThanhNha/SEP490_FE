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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {sortedMessages.map((msg, index) => {
        const isCurrentUser = msg.sender === currentUserId?.toString()
        const sender = msg.senderCustomer

        return (
          <div
            key={msg.id || index}
            className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser && (
              <img
                src={sender?.image || 'https://i.pinimg.com/736x/e8/d7/d0/e8d7d05f392d9c2cf0285ce928fb9f4a.jpg'}
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div className={`max-w-[70%]`}>
              {!isCurrentUser && (
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  {sender?.fullName}
                </p>
              )}
              <div
                className={`px-3 py-2 rounded-lg break-words ${
                  isCurrentUser
                    ? 'bg-[#516d19] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
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
            {isCurrentUser && (
              <img
                src={sender?.image || '/default-avatar.png'}
                alt="avatar"
                className="w-8 h-8 rounded-full ml-2"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

