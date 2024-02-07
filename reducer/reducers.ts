// reducers.js
import { combineReducers } from "@reduxjs/toolkit";
import { upDateMemoReducer } from "./update-reducer";

const rootReducer = combineReducers({
  upDate: upDateMemoReducer,
  // 다른 리듀서들 추가
});

export default rootReducer;
