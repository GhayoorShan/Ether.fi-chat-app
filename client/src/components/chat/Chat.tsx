import { useEffect, useMemo, useRef, useState } from "react";
import connectSocket from "../../utils/helpers";
import { socketUrl } from "../../utils/const";
import { useSelector } from "react-redux";

const Chat = () => {
  const [message, setMassage] = useState<string>("");

  const endRef = useRef<HTMLDivElement>(null);

  const { username, chatcode, chatid } = useSelector(
    (state: any) => state.chatData
  );

  console.log(username, chatcode, chatid);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const socket = useMemo(() => connectSocket(socketUrl), []);

  const handleSend = async () => {
    if (message === "") return;
    try {
      await socket.emit("sendMessage", {
        username,
        chatcode,
        chatid,
        msg: message,
      });
    } finally {
      setMassage("");
    }
  };

  useEffect(() => {
    socket.on("chatData", (data) => {
      console.log("idii---", data);
    });
  }, []);

  return (
    <div className=" grow border-l border-[#FFFFFF20] border-opacity-75 h-full flex flex-col">
      <div className="p-5 flex items-center justify-between border-b border-[#FFFFFF20] border-opacity-75 ">
        Top
      </div>
      <div className="p-5 flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#FFFFFF20] scrollbar-track-gray-200  flex flex-col gap-5 ">
        <div className=" max-w-[70%] self-end bg-[#3765da] rounded-xl ">
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
        </div>

        <div ref={endRef}></div>
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
