import { createSlice } from "@reduxjs/toolkit";

interface ChatData {
  username?: string;
  chatcode?: string;
  chatid?: string;
  timestamp?: number;
}

const initialState: ChatData = {
  username: "",
  chatcode: "",
  chatid: "",
  timestamp: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChatData(state, action: { payload: ChatData }) {
      state.username = action.payload.username;
      state.chatcode = action.payload.chatcode;
      state.chatid = action.payload.chatid;
      state.timestamp = action.payload.timestamp;
    },
  },
});

export const { addChatData } = chatSlice.actions;
export default chatSlice.reducer;
