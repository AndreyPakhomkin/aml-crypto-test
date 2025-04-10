import { ICenterNode, IGraphLink, IGraphNode } from "../../entities/types";

export const findRelatedNodes = (centerNodeId: string, links: IGraphLink[], centerNodes: Record<string, ICenterNode>, nodes: IGraphNode[]) => {
    const directlyConnected = new Set<string>();

    // 1. Найти все ноды, напрямую связанные с центром
    links.forEach(link => {
        if (link.source === centerNodeId) {
            directlyConnected.add(link.target as string);
        } else if (link.target === centerNodeId) {
            directlyConnected.add(link.source as string);
        }
    });

    let relatedNodesId: string[] = [];
    let groupBalance: number = Math.trunc(nodes.find(n => n.id === centerNodeId)!.usdt_balance);

    directlyConnected.forEach(nodeId => {
        // Пропускаем, если эта нода тоже центр
        if (centerNodes[nodeId]) return;

        // 2. Проверяем, есть ли у этой ноды связи, кроме связи с центром
        const otherConnections = links.filter(link => {
            const source = link.source as string;
            const target = link.target as string;

            // связь, в которой эта нода участвует
            const involved = source === nodeId || target === nodeId;

            // и это не связь с центром
            const notWithCenter =
                (source !== centerNodeId && target !== centerNodeId);

            return involved && notWithCenter;
        });

        if (otherConnections.length === 0) {
            relatedNodesId.push(nodeId);
            const node = nodes.find(n => n.id === nodeId);
            if (node) {
                groupBalance += Math.trunc(node.usdt_balance);
            }
        }
    });

    return { relatedNodesId, groupBalance };
}
