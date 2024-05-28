import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import socketReducer from "./socketSlice";
import chatDataSlice from "./chatDataSlice";

// Persist config
const persistConfig = {
  key: "chat",
  storage,
  whitelist: ["username", "chatId", "chatcode", "chatHistory", "participants"],
};

const chatData = persistReducer(persistConfig, chatDataSlice);

// Create store
const store = configureStore({
  reducer: {
    chatData,
    socket: socketReducer,
  },
});

const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
