import { IGraphLink, IGraphNode } from "../../entities/types";
import { randomUniform } from "d3-random";

interface CalculateInitialNodePositionsProps {
    nodes: IGraphNode[];
    links: IGraphLink[];
    existingNodes: Map<IGraphNode["id"], IGraphNode>;
}

const calculateInitialNodePositions = ({
    nodes,
    links,
    existingNodes,
}: CalculateInitialNodePositionsProps): IGraphNode[] => {
    const newUnlinkedNodes = nodes.filter(
        (node) => !links.some((link) => link.source === node.id || link.target === node.id)
    );

    const hasNewUnlinkedNodes = newUnlinkedNodes.length > 0;
    const minRadius = 1000;
    const maxRadius = 1500;
    const generateRandomRadius = randomUniform(minRadius, maxRadius);

    let unlinkedGroupOffsetX = 0;
    let unlinkedGroupOffsetY = 0;

    if (hasNewUnlinkedNodes) {
        const radius = generateRandomRadius();
        const angle = Math.random() * 2 * Math.PI;
        unlinkedGroupOffsetX = radius * Math.cos(angle);
        unlinkedGroupOffsetY = radius * Math.sin(angle);
    }

    return nodes.map((node) => {
        if (existingNodes.has(node.id)) {
            return existingNodes.get(node.id)!;
        }

        const relatedLinks = links.filter(
            (link) => link.source === node.id || link.target === node.id
        );

        let x: number | undefined = node.x;
        let y: number | undefined = node.y;

        if (relatedLinks.length > 0) {
            const mainNode = relatedLinks
                .map(
                    (link) =>
                        existingNodes.get(link.source as string) ??
                        existingNodes.get(link.target as string)
                )
                .find(Boolean);

            if (mainNode && mainNode.x !== undefined && mainNode.y !== undefined) {
                let incoming = 0;
                let outgoing = 0;

                relatedLinks.forEach((link) => {
                    const tokensSum = (link.tokens_amount || []).reduce((sum, token) => sum + (token.usdt_amount || 0), 0);
                    const totalAmount = (link.usdt_amount || 0) + tokensSum;

                    if (link.target === node.id) incoming += totalAmount;
                    if (link.source === node.id) outgoing += totalAmount;
                });

                x = mainNode.x + (incoming >= outgoing ? 100 : -100);
                y = mainNode.y + (Math.random() - 0.5) * 50;
            } else {
                // Если не нашел ноду, возврашаю просто рандомные числа
                x = (Math.random() - 0.5) * 10;
                y = (Math.random() - 0.5) * 10;
            }
        } else {
            x = (node.x || 0) + unlinkedGroupOffsetX;
            y = (node.y || 0) + unlinkedGroupOffsetY;
        }

        return { ...node, x, y };
    });
};

export default calculateInitialNodePositions;