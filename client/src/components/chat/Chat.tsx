import { useEffect, useRef, useState } from "react";
import connectSocket from "../../utils/helpers";
import { socketUrl } from "../../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { updateChatHistory } from "../../redux/chatDataSlice";

const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<string>("");

  const endRef = useRef<HTMLDivElement>(null);

  const { username, chatcode, chatId, chatHistory } = useSelector(
    (state: any) => state.chatData
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    const newSocket = connectSocket(socketUrl);
    setSocket(newSocket);

    newSocket.on("receiveMessages", (data: any) => {
      dispatch(
        updateChatHistory({
          username: data.username,
          content: data.msg,
          chatId: data.chatId,
        })
      );
    });

    // clean up to close instance and to avoid side effects
    return () => {
      newSocket.close();
    };
  }, [dispatch]);

  const handleSend = () => {
    if (message === "") return;
    const response: any = socket.emit("sendMessage", {
      username,
      chatcode,
      chatId,
      msg: message,
    });

    if (response.connected) {
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="grow border-l border-[#FFFFFF20] border-opacity-75 h-full flex flex-col">
      <div className="p-5 flex items-center justify-between border-b border-[#FFFFFF20] border-opacity-75 ">
        {/* Top */}
      </div>
      <div className="p-5 flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#FFFFFF20] scrollbar-track-gray-200 flex flex-col gap-5">
        {chatHistory?.map((item: any, index: number) => (
          <div
            key={index}
            className={`min-w-40 max-w-[70%] rounded-xl ${
              username === item.username
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
          onKeyPress={handleKeyPress}
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
