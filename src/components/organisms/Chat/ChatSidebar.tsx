import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setSelectedChannel } from "@/store/slice/chatSlice";

export default function ChatSidebar() {
  const dispatch = useDispatch();
  const channels = useSelector((state: RootState) => state.chat.channels);
  const selectedChannel = useSelector((state: RootState) => state.chat.selectedChannel);

  return (
    <div className="w-[300px] border-r bg-white h-screen flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b">Tin nhắn</h2>
      <ul className="flex-1 overflow-y-auto p-2 space-y-2">
        {channels.map((channel) => {
          const isSelected = selectedChannel?.id === channel.id;
          const hasUnread = channel.unreadCount > 0;

          return (
            <li
              key={channel.id}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              onClick={() => dispatch(setSelectedChannel(channel))}
            >
              <div className="relative">
                {hasUnread && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-black truncate">
                  {channel.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {channel.lastMessage || "Không có tin nhắn"}
                </div>
              </div>
              {hasUnread && (
                <span className="text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                  {channel.unreadCount}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
