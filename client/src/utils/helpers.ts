import { io } from "socket.io-client"; // Assuming proper type definitions for socket.io-client

export default function connectSocket(url: string) {
  const socket = io(url);
  return socket;
}
