import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import chatDataSlice from "./chatDataSlice";

// Persist config
const persistConfig = {
  key: "chat",
  storage,
  whitelist: ["username", "chatId", "chatcode"],
};

const chatData = persistReducer(persistConfig, chatDataSlice);

// Create store
const store = configureStore({
  reducer: {
    chatData,
  },
});

const persistor = persistStore(store);

export { store, persistor };
