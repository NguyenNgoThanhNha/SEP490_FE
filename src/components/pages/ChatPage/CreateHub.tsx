import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

type ChatHubProps = {
  userId: number;
  onReceiveMessage: (fromUserId: number, message: string) => void;
};

export const ChatHub = ({ userId, onReceiveMessage }: ChatHubProps) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://solaceapi.ddnsking.com/chat")
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR");
        return newConnection.invoke("JoinGroup", `user-${userId}`);
      })
      .catch((err) => console.error("❌ Error connecting:", err));

    newConnection.on("ReceiveMessage", (fromUserId, message) => {
      onReceiveMessage(fromUserId, message);
    });

    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [userId, onReceiveMessage]);

  return connection;
};