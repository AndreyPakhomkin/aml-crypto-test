import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphState, IGetDataResponse } from "./types";
import { graphApi } from "./graphApi";


const initialState: GraphState = {
    data: {
        nodes: [],
        links: [],
    },
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
                state.data.nodes = [...state.data.nodes, ...action.payload.nodes];
                const formattedLinks = action.payload.links.map(({ sender, receiver, id, ...rest }) => ({
                    ...rest,
                    source: sender,
                    target: receiver,
                    label: id
                }));
                state.data.links = [...state.data.links, ...formattedLinks]
            })
            .addMatcher(graphApi.endpoints.getData.matchRejected, (state) => {
                state.error.errorStatus = true;
                state.error.errorMessage = 'Error fetching data'
            })
    },
});

export default graphSlice.reducer;
