import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphState, IGetDataResponse } from "./types";
import { graphApi } from "./graphApi";


const initialState: GraphState = {
    nodes: [],
    links: [],
    error: {
        errorStatus: false,
        errorMessage: null
    }
};

const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(graphApi.endpoints.getData.matchPending, (state) => {
                state.error.errorStatus = false;
                state.error.errorMessage = null;
            })
            .addMatcher(graphApi.endpoints.getData.matchFulfilled, (state, action: PayloadAction<IGetDataResponse>) => {
                state.nodes = action.payload.nodes;
                state.links = action.payload.links;
            })
            .addMatcher(graphApi.endpoints.getData.matchRejected, (state) => {
                state.error.errorStatus = true;
                state.error.errorMessage = 'Error fetching data'
            })
    },
});

export default graphSlice.reducer;
