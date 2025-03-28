export interface IToken {
    name: string,
    amount: number,
    usdt_amount: number
}

export interface INode {
    id: string,
    type: string,
    name: string,
    usdt_balance: number,
    tokens: IToken[]
}

export interface ILink {
    id: string,
    sender: string,
    receiver: string,
    usdt_umount: number,
    tokens_amount: IToken[]
}

export interface IError {
    errorStatus: boolean,
    errorMessage: string | null
}

export interface GraphState {
    nodes: INode[];
    links: ILink[];
    error: IError
}

export interface IGetDataResponse {
    nodes: INode[],
    links: ILink[]
}
