import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userType {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AppState {
  isLoggedIn: boolean;
  user: null | userType;
  socialLogin: boolean;
}

const initialState = {
  isLoggedIn: false,
  user: null,
  socialLogin: false,
} satisfies AppState as AppState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser(state, actions: PayloadAction<{ isLoggedIn: boolean; user: userType }>) {
      state.isLoggedIn = actions.payload.isLoggedIn;
      state.user = actions.payload.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
