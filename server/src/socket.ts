import { Server as SocketIO, Socket } from "socket.io";
import { getMessagesForUserAndChat, saveMessage } from "./services/userService";

const userSockets: Map<string, Socket> = new Map();
const userRooms: Map<string, string[]> = new Map();
let activeUsersCount: number = 0;

export default function initializeSocket(io: SocketIO) {
  io.on("connection", (socket: Socket) => {
    console.log(" @@@@ Socket user connected.");

    // Increment active users count upon connection
    activeUsersCount++;

    socket.on("join", async (e) => {
      try {
        let data = await getMessagesForUserAndChat(e.username, e.chatcode);
        userSockets.set(e.username, socket);
        if (userRooms.has(e.username)) {
          userRooms.get(e.username)?.push(e.chatcode);
        } else {
          userRooms.set(e.username, [e.chatcode]);
        }
        socket.join(e.chatcode);
        // Emit the chat data and messages to the client
        console.log(data);

        socket.emit("chatData", data);
      } catch (error) {
        console.error("Error joining chat:", error.message);
      }
    });

    socket.on("sendMessage", async (payload) => {
      try {
        // Emit the message to the specified room
        let { username, chatcode, chatid, msg } = payload;
        console.log(payload);

        socket.broadcast.to(chatcode).emit("message", payload);
        console.log(`Message emitted to room ${chatcode}:`, {
          payload,
        });

        // Save the message to the database
        await saveMessage({ msg, username, chatid }); // Adjust this call according to your message service implementation
        console.log("Message saved to the database:", {
          payload,
        });
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      // Decrement active users count upon disconnection
      activeUsersCount--;

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

    // Event to get the number of active users
    socket.on("getActiveUsersCount", () => {
      socket.emit("activeUsersCount", activeUsersCount);
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
