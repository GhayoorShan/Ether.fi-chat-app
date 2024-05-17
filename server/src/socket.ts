import { Server as SocketIO, Socket } from "socket.io";
import { getMessagesForUserAndChat, saveMessage } from "./services/userService";

const userSockets: Map<string, Socket> = new Map();
const userRooms: Map<string, string[]> = new Map();
export default function initializeSocket(io: SocketIO) {
  io.on("connection", (socket: Socket) => {
    console.log(" @@@@ Socket user connected.");

    // console.log(io.of("/").adapter);
    socket.on("joinRoom", async (e) => {
      try {
        console.log("pechy", e);

        let data = await getMessagesForUserAndChat(e.username, e.chatcode);
        console.log(data);

        userSockets.set(e.username, socket);
        if (userRooms.has(e.username)) {
          userRooms.get(e.username)?.push(e.chatcode);
        } else {
          userRooms.set(e.username, [e.chatcode]);
        }
        socket.join(e.chatcode);
        // Emit the chat data and messages to the client
        socket.emit("chatData", data);
      } catch (error) {
        console.error("Error joining chat:", error.message);
      }
    });

    socket.on("sendMessage", async (payload) => {
      try {
        let { msg, username, chatcode, chatId } = payload;

        // Emit the message to the specified room
        io.emit("receiveMessages", { msg, username });
        console.log(`Message emitted to room ${chatcode}:`, {
          msg,
          username,
          chatcode,
          chatId,
        });

        // Save the message to the database
        await saveMessage({ msg, username, chatId }); // Adjust this call according to your message service implementation
        console.log("Message saved to the database:", {
          msg,
          username,
          chatcode,
        });
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      // Find the user associated with the socket
      const username = getSocketForUser(socket);
      if (username) {
        console.log(`User with userName ${username} disconnected`);
        // Find all rooms associated with the user
        const rooms = userRooms.get(username) || [];
        rooms.forEach((room) => {
          // Emit disconnect message to users in the same room
          io.to(room).emit("message", `${username} has left the chat`);
        });
        // Remove user from userRooms map
        userRooms.delete(username);
      }
    });

    function getSocketForUser(socket: Socket): string | undefined {
      for (const [username, s] of userSockets.entries()) {
        if (s === socket) {
          return username;
        }
      }
      return undefined;
    }
  });
}
