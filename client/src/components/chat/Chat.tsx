import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  updateChatHistory,
  updateParticipants,
} from "../../redux/chatDataSlice";

import { useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { socketUrl } from "../../utils/const";
import toast from "react-hot-toast";

const Chat = () => {
  const [message, setMessage] = useState<string>("");

  const endRef = useRef<HTMLDivElement>(null);

  const { username, chatcode, chatName, chatId, chatHistory } = useSelector(
    (state: any) => state.chatData
  );

  const navigate = useNavigate();

  const socket = useAppSelector((state) => state.socket.socket);
  // console.log("socket in chat room ", socket);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`${socketUrl}/analytics/messages-by-user`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleNotification = (data: any) => {
    toast.success(data);
    console.log("notification---", data);
  };

  const handleReceiveMessages = (data: any) => {
    console.log("Chat data received:", data);
    dispatch(
      updateChatHistory({
        username: data.username,
        content: data.msg,
        chatId: data.chatId,
        chatName: data.chatName,
      })
    );
  };
  const handleParticipantAdded = (data: any) => {
    console.log("participantAdded---", data);
    dispatch(updateParticipants(data));
  };
  const handleParticipantLeft = (data: any) => {
    console.log("participantLeft---", data);
  };

  const handleActiveUsers = (users: string[]) => {
    console.log("ActiveUsers---", users);
  };
  useEffect(() => {
    if (socket) {
      socket.on("notification", handleNotification);
      socket.on("participantAdded", handleParticipantAdded);
      socket.on("receiveMessages", handleReceiveMessages);
      socket.on("participantLeft", handleParticipantLeft);
      socket.on("activeUsers", handleActiveUsers);

      // Clean up the listeners on component unmount or when socket changes
      return () => {
        socket.off("notification", handleNotification);
        socket.off("receiveMessages", handleReceiveMessages);
        socket.off("participantAdded", handleParticipantAdded);
        socket.off("participantLeft", handleParticipantLeft);
        socket.off("activeUsers", handleActiveUsers);
      };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (message === "") return;
    socket?.emit("sendMessage", {
      username,
      chatcode,
      chatId,
      msg: message,
    });
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  const handleLeftRoom = () => {
    socket?.emit("leaveRoom", {
      username,
      chatcode,
    });
    navigate("/");
  };

  return (
    <div className="grow border-l border-[#FFFFFF20] border-opacity-75 h-full flex flex-col">
      <div className="p-5 flex items-center justify-between border-b border-[#FFFFFF20] border-opacity-75 ">
        <p>{chatName}</p>
        {/* <button
          onClick={handleLeftRoom}
          className="bg-red-500 px-4 py-2 rounded-md"
        >
          Leave Room
        </button> */}
      </div>
      <div className="p-5 flex-1 overflow-y-scroll scrollbar flex flex-col gap-5">
        {chatHistory?.map((item: any, index: number) => (
          <div
            key={index}
            className={`min-w-40 max-w-[70%] rounded-xl ${
              username === item?.username
                ? "self-end bg-[#3765da]"
                : "self-start bg-[#11192a]"
            }`}
          >
            <div className="flex flex-col gap-3 p-3">
              <span className="text-purple-400">~{item?.username}</span>
              <p className="">{item?.content}</p>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="px-5 py-3 flex items-center justify-between gap-5 border-t border-[#FFFFFF20] border-opacity-75">
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white p-5"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-[#3765da] px-5 py-2 rounded-md cursor-pointer"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
