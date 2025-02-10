import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../lib/slices/authSlice";
import { useDispatch } from "react-redux";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistedConfig = {
  auth: {
    key: "auth",
    storage,
  },
};

const persistedAuthReducer = persistReducer(persistedConfig.auth, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
