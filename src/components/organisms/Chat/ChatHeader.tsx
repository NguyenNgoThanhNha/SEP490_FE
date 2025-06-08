import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const ChatHeader: React.FC = () => {
  const selectedChannel = useSelector((state: RootState) => state.chat.selectedChannel);

  if (!selectedChannel) {
    return (
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold"></h2>
      </div>
    );
  }

  return (
    <div className="p-4 border-b bg-white flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{selectedChannel.name}</h2>
      </div>
    </div>
  );
};

