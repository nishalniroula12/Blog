import { createSlice } from "@reduxjs/toolkit";

const saveUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: saveUser || null,
  isAuthenticate:saveUser ? true : false
};

export const slice = createSlice({
  name: "post",

  initialState,

  reducers: {
    loginUser: (state, action) => {
      console.log("this is the data", action.payload);

      // save in redux state
      state.user = action.payload;
      state.isAuthenticate = true

      // save in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticate = false;

      localStorage.removeItem("user");
    },
  },
});

export const { loginUser, logoutUser } = slice.actions;

export default slice.reducer;