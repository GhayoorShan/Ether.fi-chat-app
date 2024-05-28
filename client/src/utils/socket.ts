// src/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

let socket: Socket | null = null;

export const initiateSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};
