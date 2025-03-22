import * as signalR from "@microsoft/signalr";

const hubUrl = "https://solaceapix.ddnsking.com/chat"; 

let connection: signalR.HubConnection | null = null;

export const startConnection = async () => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    await connection.start();
    console.log("Connected to SignalR Hub!");
  } catch (error) {
    console.error("Connection error: ", error);
  }
};

export const sendMessage = async (channelId: string, senderId: number, content: string) => {
  if (!connection) return;
  await connection.invoke("SendMessageToChannel", channelId, senderId, content, "text");
};

export const onReceiveMessage = (callback: (message: unknown) => void) => {
  if (!connection) return;
  connection.on("ReceiveMessage", callback);
};

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
    console.log("SignalR connection stopped");
  }
};
