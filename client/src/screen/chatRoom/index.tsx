import Chat from "../../components/chat/Chat";
import ChatRoomInfo from "../../components/chatRoomInfo/ChatRoomInfo";

const ChatRoom = () => {
  return (
    <div className="container h-[90vh] bg-[#111928BF] backdrop-blur-sm  rounded-xl flex border border-[#FFFFFF20] border-opacity-75">
      <ChatRoomInfo />
      <Chat />
    </div>
  );
};

export default ChatRoom;
