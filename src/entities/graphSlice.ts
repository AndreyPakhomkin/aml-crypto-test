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
    },
    selectedNodeId: ''
};

const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {
        setSelectedNodeId: (state, action: PayloadAction<string>) => {
            console.log('Reducer setSelectedNodeId called with:', action.payload);
            state.selectedNodeId = action.payload;
            console.log('New selectedNodeId in state:', state.selectedNodeId);
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(graphApi.endpoints.getData.matchPending, (state) => {
                state.error.errorStatus = false;
                state.error.errorMessage = null;
            })
            .addMatcher(graphApi.endpoints.getData.matchFulfilled, (state, action: PayloadAction<IGetDataResponse>) => {
                const existingNodeIds = new Set(state.data.nodes.map(node => node.id));
                const existingLinks = new Set(state.data.links.map(link => `${link.source}-${link.target}-${link.label}`));

                const newNodes = action.payload.nodes.filter(node => !existingNodeIds.has(node.id));

                const formattedLinks = action.payload.links
                    .map(({ sender, receiver, id, ...rest }) => ({
                        ...rest,
                        source: sender,
                        target: receiver,
                        label: id
                    }))
                    .filter(link => !existingLinks.has(`${link.source}-${link.target}-${link.label}`));

                state.data.nodes = [...state.data.nodes, ...newNodes];
                state.data.links = [...state.data.links, ...formattedLinks];
            })
            .addMatcher(graphApi.endpoints.getData.matchRejected, (state) => {
                state.error.errorStatus = true;
                state.error.errorMessage = 'Error fetching data'
            })
    },
});

export const { setSelectedNodeId } = graphSlice.actions;
export default graphSlice.reducer;
