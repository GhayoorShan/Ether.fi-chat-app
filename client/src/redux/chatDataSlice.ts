import { createSlice } from "@reduxjs/toolkit";
interface ChatMessage {
  username: string;
  content: string;
  chatId: string;
  chatName: string;
}

interface ChatData {
  username?: string;
  chatcode?: string;
  chatId?: string;
  chatName?: string;
  chatHistory?: ChatMessage[];
  participants?: string[];
}

const initialState: ChatData = {
  username: "",
  chatcode: "",
  chatId: "",
  chatName: "",
  chatHistory: [],
  participants: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatData(state, action: { payload: ChatData }) {
      state.username = action.payload.username;
      state.chatcode = action.payload.chatcode;
      state.chatId = action.payload.chatId;
      state.chatName = action.payload.chatName;
    },
    removeChatData(state) {
      state.username = "";
      state.chatcode = "";
      state.chatId = "";
      state.chatName = "";
      state.chatHistory = [];
      state.participants = [];
    },
    addChatHistory(state, action: { payload: ChatMessage[] }) {
      state.chatHistory = action.payload;
    },
    updateChatHistory(state, action: { payload: ChatMessage }) {
      state.chatHistory?.push(action.payload);
    },
    addParticipants(state, action: { payload: string[] }) {
      state.participants = action.payload;
    },
    updateParticipants(state, action: { payload: string }) {
      state.participants?.push(action.payload);
    },
  },
});

export const {
  addChatData,
  addChatHistory,
  updateChatHistory,
  addParticipants,
  updateParticipants,
  removeChatData,
} = chatSlice.actions;
export default chatSlice.reducer;
