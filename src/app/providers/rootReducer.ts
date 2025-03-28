import { combineReducers } from "@reduxjs/toolkit";
import { graphApi } from "../../entities/graphApi";
import graphReducer from '../../entities/graphSlice';

const rootReducer = combineReducers({
    storedData: graphReducer,
    [graphApi.reducerPath]: graphApi.reducer
})

export default rootReducer;
export type RootReducer = ReturnType<typeof rootReducer>;