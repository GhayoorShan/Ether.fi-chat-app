import { createSlice } from "@reduxjs/toolkit";

interface ChatData {
  username?: string;
  chatcode?: string;
  chatId?: string;
  chatHistory?: string[];
  participants?: string[];
}

const initialState: ChatData = {
  username: "",
  chatcode: "",
  chatId: "",
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
    },
    removeChatData(state, action: { payload: ChatData }) {
      state.username = "";
      state.chatcode = "";
      state.chatId = "";
    },
    addChatHistory(state, action: { payload: ChatData }) {
      state.chatHistory = action.payload.chatHistory;
    },
    updateChatHistory(state, action: { payload: any }) {
      state.chatHistory?.push(action.payload);
    },
    addParticipants(state, action: { payload: ChatData }) {
      state.participants = action.payload.participants;
    },
    // updateParticipants(state, action: { payload: any }) {
    //   state.chatHistory?.push(action.payload);
    // },
  },
});

export const {
  addChatData,
  addChatHistory,
  updateChatHistory,
  addParticipants,
  removeChatData,
} = chatSlice.actions;
export default chatSlice.reducer;
