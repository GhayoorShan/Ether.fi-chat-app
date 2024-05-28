import { Server as SocketIO, Socket } from "socket.io";
import { getMessagesForUserAndChat, saveMessage } from "./services/userService";

const userSockets: Map<string, Socket> = new Map();
const userRooms: Map<string, string[]> = new Map();
const activeUsers: Map<string, Set<string>> = new Map();
export default function initializeSocket(io: SocketIO) {
  io.on("connection", (socket: Socket) => {
    console.log(" @@@@ Socket user connected.");

    socket.on("joinRoom", async (e) => {
      try {
        let data = await getMessagesForUserAndChat(e.username, e.chatcode);

        userSockets.set(e.username, socket);
        if (userRooms.has(e.username)) {
          userRooms.get(e.username)?.push(e.chatcode);
        } else {
          userRooms.set(e.username, [e.chatcode]);
          socket.broadcast
            .to(e.chatcode)
            .emit("participantAdded", { username: e.username, userId: "" });
        }

        if (activeUsers.has(e.chatcode)) {
          activeUsers.get(e.chatcode)?.add(e.username);
        } else {
          activeUsers.set(e.chatcode, new Set([e.username]));
        }

        // Join the room
        socket.join(e.chatcode);

        // Emit a notification to the room that the user has joined
        io.to(e.chatcode).emit(
          "notification",
          `${e.username} has joined the chat`
        );

        // console.log("userSockets", userSockets);
        console.log("userSockets Size", userSockets.size);
        console.log("userRooms Size", userRooms.size);

        // Emit the chat data and messages to the client
        socket.emit("chatData", data);

        // Emit the list of active users in the room
        // io.to(e.chatcode).emit(
        //   "activeUsers",
        //   Array.from(userRooms.get(e.chatcode) || [])
        // );
        io.to(e.chatcode).emit(
          "activeUsers",
          Array.from(activeUsers.get(e.chatcode) || [])
        );
      } catch (error) {
        console.error("Error joining chat:", error.message);
      }
    });

    socket.on("sendMessage", async (payload) => {
      try {
        let { msg, username, chatcode, chatId } = payload;

        // Save the message to the database
        await saveMessage({ msg, username, chatId });

        // Emit the message to the specified room
        io.to(chatcode).emit("receiveMessages", { msg, username });
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
          // Remove the user from the roomUsers map
          const usersInRoom = activeUsers.get(room);
          if (usersInRoom) {
            usersInRoom.delete(username);
            // Emit updated list of active users in the room
            io.to(room).emit("activeUsers", Array.from(usersInRoom));
            // Emit disconnect message to users in the same room
            io.to(room).emit("notification", `${username} has left the chat`);
          }
        });

        // Remove user from userRooms map
        userRooms.delete(username);
        // Remove user from userSockets map
        userSockets.delete(username);
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
