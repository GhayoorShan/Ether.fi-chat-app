// import { useRef, useCallback, useState } from "react";
// import io, {
//   Socket,
//   ManagerOptions,
//   SocketOptions,
//   connect,
// } from "socket.io-client";
// import { useDispatch } from "react-redux";
// import { addChatData, updateChatHistory } from "../redux/chatDataSlice";
// import { AppDispatch } from "../redux/store";

// interface UseSocketReturn {
//   connect: (
//     url: string,
//     options?: Partial<ManagerOptions & SocketOptions>
//   ) => Promise<void>;
//   sendEvent: (event: string, message: any) => void;
//   closeConnection: () => void;
//   socket: React.MutableRefObject<Socket | null>;
//   isConnected: boolean;
//   listenForEvent: (event: string, callback: (data: any) => void) => void;
// }

// const useSocket = (): UseSocketReturn => {
//   const socket = useRef<Socket | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   const [isConnected, setIsConnected] = useState(false);

//   const connect = useCallback(
//     (url: string, options?: Partial<ManagerOptions & SocketOptions>) => {
//       return new Promise<void>((resolve, reject) => {
//         socket.current = io(url, options);

//         socket.current.on("connect", () => {
//           console.log("Socket.IO connected");
//           setIsConnected(true);
//           resolve();
//         });

//         socket.current.on("disconnect", () => {
//           console.log("Socket.IO disconnected");
//           setIsConnected(false);
//         });

//         socket.current.on("receiveMessages", (data: any) => {
//           dispatch(
//             updateChatHistory({
//               username: data.username,
//               content: data.msg,
//               chatId: data.chatId,
//             })
//           );
//         });

//         socket.current.on("connect_error", (error: Error) => {
//           console.error("Socket.IO connection error:", error);
//           reject(error);
//         });
//       });
//     },
//     [dispatch, isConnected]
//   );

//   const sendEvent = useCallback((event: string, message: any) => {
//     if (socket.current && isConnected) {
//       socket.current.emit(event, message);
//       console.log("Message sent:", message);
//     } else {
//       console.error("Socket.IO is not connected. Cannot send message.");
//     }
//   }, []);

//   const listenForEvent = useCallback(
//     (event: string, callback: (data: any) => void) => {
//       if (socket.current) {
//         socket.current.on(event, callback);
//       }
//     },
//     []
//   );

//   const closeConnection = useCallback(() => {
//     if (socket.current) {
//       socket.current.disconnect();
//       setIsConnected(false);
//     }
//   }, []);

//   return {
//     socket,
//     connect,
//     sendEvent,
//     closeConnection,
//     isConnected,
//     listenForEvent,
//   };
// };

// export default useSocket;
