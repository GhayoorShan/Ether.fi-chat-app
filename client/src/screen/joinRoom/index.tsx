import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addChatData,
  addChatHistory,
  addParticipants,
  removeChatData,
} from "../../redux/chatDataSlice";

import { useAppSelector } from "../../hooks/hooks";

function JoinRoom() {
  const [username, setUsername] = useState("");
  const [chatcode, setChatCode] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socket = useAppSelector((state) => state.socket.socket);

  const handleConnectAndJoinRoom = async () => {
    dispatch(removeChatData());
    if (username && chatcode) {
      if (socket) {
        socket.emit("joinRoom", { chatcode, username });
        socket.on("chatData", (data) => {
          console.log("Chat data received:", data);

          dispatch(
            addChatData({
              username,
              chatcode,
              chatName: data.chat.chatname,
              chatId: data?.chat._id,
            })
          );

          const chatMessages = data.messages.map(
            (msg: { username: string; content: string; chatId: string }) => ({
              username: msg.username,
              content: msg.content,
              chatId: msg.chatId,
            })
          );

          dispatch(addChatHistory(chatMessages));

          dispatch(addParticipants(data.chat.participants));

          navigate("/chat-room");
        });
      }
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <input
        type="text"
        className="rounded-lg outline-none text-black p-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your Username"
      />
      <input
        type="text"
        className="rounded-lg outline-none text-black p-2"
        value={chatcode}
        onChange={(e) => setChatCode(e.target.value)}
        placeholder="Enter your Code word"
      />
      <button
        className=" bg-[#3765da] px-5 py-2 rounded-md cursor-pointer"
        onClick={handleConnectAndJoinRoom}
      >
        Join Chat
      </button>
    </div>
  );
}

export default JoinRoom;
