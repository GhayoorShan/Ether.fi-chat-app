import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JoinRoom from "./screen/joinRoom";
import ChatRoom from "./screen/chatRoom";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="bg-cover bg-center flex items-center justify-center h-screen text-white bg-slate-800">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<JoinRoom />} />
            <Route path="/chat-room" element={<ChatRoom />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
