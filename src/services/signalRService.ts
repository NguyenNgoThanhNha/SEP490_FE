import * as signalR from "@microsoft/signalr";

const hubUrl = "https://solaceapi.ddnsking.com/chat"; 

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

export const sendMessageToChannel = async (channelId: string, senderId: string, content: string, messageType: string) => {
  if (!connection) {
    console.error("SignalR connection is not established.");
    return;
  }
  try {
    console.log("Sending message to server:", { channelId, senderId, content, messageType: "text" });
    await connection.invoke("SendMessageToChannel", channelId, senderId, content, messageType, null);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
export const sendMessage = async (senderId: string, recipientId: string, content: string) => {
  if (!connection) return;
  await connection.invoke("SendMessage",  senderId, recipientId, content);

}

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
    console.log("SignalR connection stopped");
  }
};
