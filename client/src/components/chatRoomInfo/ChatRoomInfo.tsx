import { useSelector } from "react-redux";

const ChatRoomInfo = () => {
  const { participants } = useSelector((state: any) => state.chatData);

  return (
    <div className="basis-1/3 flex flex-col p-5 ">
      <p className="text-[20px]">Users</p>

      <div className="p-5">
        {participants?.map((item: any) => (
          <p className="text-blue-500 py-2"> {item.username}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomInfo;
