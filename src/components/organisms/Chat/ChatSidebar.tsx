import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setSelectedChannel } from "@/store/slice/chatSlice";

export default function ChatSidebar() {
  const dispatch = useDispatch();
  const channels = useSelector((state: RootState) => state.chat.channels);
  const selectedChannel = useSelector((state: RootState) => state.chat.selectedChannel);
  
  return (
    <div className="w-[280px] border-r p-4 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Kênh Chat</h2>
      <ul className="space-y-2">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className={`p-2 rounded cursor-pointer ${
              selectedChannel?.id === channel.id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
            onClick={() => dispatch(setSelectedChannel(channel))}
          >
            {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
