import { IGraphLink, IGraphNode } from "../../entities/types";

interface CalcInitialNodePositionsProps {
    nodes: IGraphNode[];
    existingNodes: Map<string, IGraphNode>;
    links: IGraphLink[],
    centerNodes: string[]
}

interface IArea {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
}

// Принимать нужно новые ноды и существующие ноды
const calcNodePositions = ({ nodes, existingNodes, links, centerNodes }: CalcInitialNodePositionsProps): IGraphNode[] => {
    return nodes.map((node) => {
        // Проверяем, является ли нода центральной
        if (centerNodes.includes(node.id)) {
            // если нода центральная, ищем ее в существующих
            if (existingNodes.has(node.id)) {
                // если центральная нода есть в существующих, менять ничего не надо
                return { ...node }
            } else {
                // если центральная нода только что добавлена, зададим ей координаты и вернем с ними
                let resultNode;
                if (existingNodes.entries.length === 0) {
                    resultNode = setStartRandomCoords(node);
                } else {
                    const forbiddenArea = findExistingGraphCoords(existingNodes)
                    resultNode = getRandomCoords(node, forbiddenArea)
                }
                return resultNode
            }
        } else {
            // если нода не центральная, зададим ей смещение относительно центра ее графа

            // для начала определим ее центр
            const link = links.find(link => link.source === node.id || link.target === node.id);
            const localCenterNodeId = link!.source === node.id ? link!.target : link!.source;
            const localCenterNode = nodes.find(n => n.id === localCenterNodeId);

            // затем посчитаем переводы и вернем новые координаты
            const nodeWithOffset = setOffset(node, localCenterNode!, links)

            return nodeWithOffset
        }
    });
};

export default calcNodePositions;

const findExistingGraphCoords = (existingNodes: Map<string, IGraphNode>): IArea => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    existingNodes.forEach(node => {
        if (node.x < minX) minX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.x > maxX) maxX = node.x;
        if (node.y > maxY) maxY = node.y;
    });

    return { minX, minY, maxX, maxY };
};

const getRandomCoords = (node: IGraphNode, forbiddenArea: IArea | undefined) => {
    if (!forbiddenArea) {
        const radius = 100;
        const angle = Math.random() * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return { ...node, x, y };
    }

    // Вычисляем максимальный радиус
    const points = [
        { x: forbiddenArea.minX, y: forbiddenArea.minY },
        { x: forbiddenArea.maxX, y: forbiddenArea.maxY }
    ];

    const maxRadius = Math.max(
        ...points.map(p => Math.sqrt(p.x ** 2 + p.y ** 2))
    );

    let x, y;

    do {
        // Генерируем случайную точку в пределах круга с радиусом maxRadius
        const angle = Math.random() * 2 * Math.PI;
        const r = Math.random() * maxRadius;
        x = r * Math.cos(angle);
        y = r * Math.sin(angle);
    } while (
        x >= forbiddenArea.minX && x <= forbiddenArea.maxX &&
        y >= forbiddenArea.minY && y <= forbiddenArea.maxY
    );

    return { ...node, x, y };
};


const setStartRandomCoords = (node: IGraphNode) => {
    const radius = 100;
    const angle = Math.random() * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return { ...node, x, y };
}

const setOffset = (node: IGraphNode, localCenterNode: IGraphNode, links: IGraphLink[]) => {
    let incoming = 0;
    let outgoing = 0;
    const offset = 300;
    let x = 0;
    let y = 0;

    const relatedLinks = links.filter(link => link.source === node.id || link.target === node.id);

    relatedLinks.forEach(link => {
        const tokensSum = (link.tokens_amount || []).reduce((sum, token) => sum + (token.usdt_amount || 0), 0);
        const totalAmount = (link.usdt_amount || 0) + tokensSum;

        if (link.target === node.id) incoming += totalAmount;
        if (link.source === node.id) outgoing += totalAmount;

        x = node.x! + (incoming >= outgoing ? (localCenterNode.x + offset) : (localCenterNode.x - offset));
        y = node.y! + (Math.random() - 0.5) * 50;
    })

    return { ...node, x, y }
}