import { useState, useEffect, useMemo, useRef } from "react";
import connectSocket from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { socketUrl } from "../../utils/const";
import { useDispatch } from "react-redux";
import {
  addChatData,
  addChatHistory,
  addParticipants,
  removeChatData,
} from "../../redux/chatDataSlice";

function JoinRoom() {
  const [username, setUsername] = useState("");
  const [chatcode, setChatCode] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socket = useMemo(() => connectSocket(socketUrl), []);

  const handleJoinRoom = () => {
    dispatch(removeChatData({}));
    if (username && chatcode) {
      let response: any = socket.emit("joinRoom", {
        chatcode,
        username,
      });

      if (response?.connected) {
        socket.on("chatData", (data) => {
          dispatch(
            addChatData({
              username,
              chatcode,
              chatId: data.chat._id,
            })
          );
          dispatch(addChatHistory({ chatHistory: data.messages }));
          dispatch(addParticipants({ participants: data.chat.participants }));
        });

        navigate("/chat-room");
      } else {
        console.error("Failed to join chat room:", response?.error);
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
        onClick={handleJoinRoom}
      >
        Join Chat
      </button>
    </div>
  );
}

export default JoinRoom;
