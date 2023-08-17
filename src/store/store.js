import { configureStore } from "@reduxjs/toolkit";
import NewsReducer from "./slices/NewsSlice";

export const store = configureStore({
  reducer: {
    news:NewsReducer,
  }
});
