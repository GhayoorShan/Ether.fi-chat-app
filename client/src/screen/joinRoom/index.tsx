import { useState, useEffect, useMemo, useRef } from "react";
import connectSocket from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { socketUrl } from "../../utils/const";
import { useDispatch } from "react-redux";
import { addChatData } from "../../redux/chatDataSlice";

interface Message {
  username: string;
  message: string;
}

function JoinRoom() {
  const [username, setUsername] = useState("");
  const [chatcode, setChatCode] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const socket = useMemo(() => connectSocket(socketUrl), []);

  const handleJoinRoom = () => {
    if (username && chatcode) {
      let response: any = socket.emit("join", {
        chatcode,
        username,
      });

      if (response?.connected) {
        socket.on("chatData", (data) => {
          dispatch(
            addChatData({
              username,
              chatcode,
              timestamp: Date.now(),
              chatid: data.chat._id,
            })
          );
        });
        navigate("/chat-room");
      } else {
        console.error("Failed to join chat room:", response?.error);
      }
    }
  };
  console.log("---username----", username, chatcode);

  return (
    <div className="flex flex-col gap-5">
      {/* <h2 className="text-center">Join Chat </h2> */}
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
      {/* <p className="text-center">Or</p>
      <button
        className=" px-5 py-2 rounded-md cursor-pointer"
        onClick={() => {
          navigate("/create-room");
        }}
      >
        Create a Chatroom
      </button> */}
    </div>
  );
}

export default JoinRoom;
