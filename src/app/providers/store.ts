import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { graphApi } from "../../entities/graphApi";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(graphApi.middleware, graphApi.middleware)
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
