import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force"

export interface IToken {
    name: string,
    amount: number,
    usdt_amount: number
}

export interface IGraphNode extends SimulationNodeDatum {
    id: string,
    type: string,
    name: string,
    usdt_balance: number,
    tokens: IToken[],
    x: number,
    y: number
}

export interface ILinkFromApi {
    id: string,
    sender: string,
    receiver: string,
    usdt_amount: number,
    tokens_amount: IToken[]
}

export interface IGraphLink extends SimulationLinkDatum<IGraphNode> {
    label: string,
    source: IGraphNode | string,
    target: IGraphNode | string,
    usdt_amount: number,
    tokens_amount: IToken[]
}

export interface IError {
    errorStatus: boolean,
    errorMessage: string | null
}

export interface GraphState {
    data: {
        nodes: IGraphNode[],
        links: IGraphLink[],
    },
    error: IError
}

export interface IGetDataResponse {
    nodes: IGraphNode[],
    links: ILinkFromApi[]
}
