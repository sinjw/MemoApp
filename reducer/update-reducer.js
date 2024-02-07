import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const updateReducer = createSlice({
  name: "memoUpdateReducer",
  initialState: initialState,
  reducers: {
    setUpdateMemo: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUpdateMemo } = updateReducer.actions;
export const upDateMemoReducer = updateReducer.reducer;
