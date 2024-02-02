import { createSlice } from "@reduxjs/toolkit";

interface ButtonState {
  isClicked: boolean;
}

const initialState: ButtonState = {
  isClicked: false,
};

const buttonSlice = createSlice({
  name: "button",
  initialState,
  reducers: {
    clickButton: (state) => {
      state.isClicked = true;
    },
  },
});

export const { clickButton } = buttonSlice.actions;
export default buttonSlice.reducer;
