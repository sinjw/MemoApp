import { configureStore } from "@reduxjs/toolkit";
import memodataReducer from "../reducers/memodata-reducer";
const store = configureStore({
  reducer: {
    button: buttonSlice,
    modalbutton: modalButton,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
