import { useEffect, useMemo, useRef, useState } from "react";
import connectSocket from "../../utils/helpers";
import { socketUrl } from "../../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { updateChatHistory } from "../../redux/chatDataSlice";

const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [message, setMassage] = useState<string>("");

  const endRef = useRef<HTMLDivElement>(null);

  const { username, chatcode, chatId, chatHistory } = useSelector(
    (state: any) => state.chatData
  );

  console.log("-------------", username, chatcode, chatId, chatHistory);
  const dispatch = useDispatch();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  useEffect(() => {
    const newSocket = connectSocket(socketUrl);
    setSocket(newSocket);

    let receiveMsg: any = newSocket.on("receiveMessages", (data: any) => {
      dispatch(
        updateChatHistory({
          username: data.username,
          content: data.msg,
          chatId: data.chatId,
        })
      );
    });
    if (receiveMsg) {
    }

    // clean up to close instance and to avoid side effects
    return () => {
      newSocket.close();
    };
  }, []);

  const handleSend = () => {
    if (message === "") return;
    let response: any = socket.emit("sendMessage", {
      username,
      chatcode,
      chatId,
      msg: message,
    });

    if (response.connected) {
      setMassage("");
    }
  };

  return (
    <div className=" grow border-l border-[#FFFFFF20] border-opacity-75 h-full flex flex-col">
      <div className="p-5 flex items-center justify-between border-b border-[#FFFFFF20] border-opacity-75 ">
        {/* Top */}
      </div>
      <div className="p-5 flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#FFFFFF20] scrollbar-track-gray-200  flex flex-col gap-5 ">
        {chatHistory?.map((item: any) => {
          return (
            <div
              className={`min-w-40 max-w-[70%]  rounded-xl ${
                username === item.username
                  ? "self-end bg-[#3765da]"
                  : "self-start bg-[#11192a]"
              }`}
            >
              <div className="flex flex-col gap-3 p-3 ">
                <span className="text-purple-400">~{item?.username}</span>
                <p className="">{item?.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef}></div>
        {/* <div className=" max-w-[70%] self-end bg-[#3765da] rounded-xl ">
          <div className="flex flex-col gap-3 p-3 ">
            <span>UserName</span>
            <p className="">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the standard dummy text ever since
              the 1500s,{" "}
            </p>
          </div>
        </div>
        <div className=" max-w-[70%] self-start bg-[#11192a] rounded-xl ">
          <div className="flex flex-col gap-3 p-3 ">
            <span>UserName</span>
            <p className="">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the standard dummy text ever since
              the 1500s,{" "}
            </p>
          </div>
        </div> */}
      </div>
      <div className="px-5 py-3 flex items-center justify-between gap-5 border-t border-[#FFFFFF20] border-opacity-75 ">
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white p-5"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            // e.preventDefault();
            setMassage(e.target.value);
          }}
        />
        <button
          className=" bg-[#3765da] px-5 py-2 rounded-md cursor-pointer"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
