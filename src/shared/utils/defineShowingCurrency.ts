import { IGraphLink } from "../../entities/types";


export const defineShowingCurrency = (displayCurrency: 'usdt' | 'tokens', d: IGraphLink) => {
    let balanceText: string = '';
    if (displayCurrency === 'usdt') {
        balanceText = d.usdt_amount ? `${Math.trunc(d.usdt_amount)} USDT` : ""
    } else {
        d.tokens_amount.map((token) => {
            balanceText = balanceText + `${token.name} : ${Math.trunc(token.amount)} `
        })
    }
    return balanceText
}