import { configureStore } from "@reduxjs/toolkit";
import chatDataSlice from "./chatDataSlice";

const store = configureStore({
  reducer: {
    chatData: chatDataSlice,
  },
});

export default store;
