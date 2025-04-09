import { createSlice, isAction, PayloadAction } from "@reduxjs/toolkit";
import { GraphState, IGetDataResponse, IGraphNode } from "./types";
import { graphApi } from "./graphApi";
import { findNewCenterNode } from "../shared/utils/findNewCenterNode";


const initialState: GraphState = {
    data: {
        nodes: [],
        links: [],
    },
    error: {
        errorStatus: false,
        errorMessage: null
    },
    selectedNodeId: '',
    centerNodes: [],
    displayCurrency: 'usdt'
};

const graphSlice = createSlice({
    name: "graph",
    initialState,
    reducers: {
        setSelectedNodeId: (state, action: PayloadAction<string>) => {
            state.selectedNodeId = action.payload;
        },
        setDisplyCurrency: (state, action: PayloadAction<'usdt' | 'tokens'>) => {
            if (state.displayCurrency !== action.payload) {
                state.displayCurrency = action.payload
            }
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

                const centerNode = action.payload.links.length === 0 ? action.payload.nodes[0].id : findNewCenterNode(formattedLinks);

                state.data.nodes = [...state.data.nodes, ...newNodes];
                state.data.links = [...state.data.links, ...formattedLinks];

                if (centerNode !== null && centerNode !== undefined) {
                    state.centerNodes = [...state.centerNodes, centerNode]
                }
            })
            .addMatcher(graphApi.endpoints.getData.matchRejected, (state) => {
                state.error.errorStatus = true;
                state.error.errorMessage = 'Error fetching data'
            })
    },
});

export const { setSelectedNodeId, setDisplyCurrency } = graphSlice.actions;
export default graphSlice.reducer;
