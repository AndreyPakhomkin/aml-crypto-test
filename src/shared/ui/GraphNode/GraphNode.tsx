import { ICenterNode, IGraphNode } from "../../../entities/types";

interface GraphNodeProps {
    node: IGraphNode;
    centerNodes: Record<string, ICenterNode>,
}

const GraphNode: React.FC<GraphNodeProps> = ({ node, centerNodes }) => {
    const isGroup = centerNodes[node.id] !== undefined && centerNodes[node.id].isCollapsed;
    const titleText = isGroup ? `Group of: ${node.id}` : `Id: ${node.id}`;
    const balanceText =
        isGroup && centerNodes[node.id].groupBalance !== null ?
            `${centerNodes[node.id].groupBalance} USDT`
            :
            `Balance: ${Math.trunc(node.usdt_balance)} USDT`;

    return (
        <div className="node-content">
            <div>{titleText}</div>
            {!isGroup &&
                <>
                    <div>Name: {node.name ? `${node.name}` : `unknown`}</div>
                    <div>{balanceText}</div>
                </>
            }
            {isGroup &&
                <>
                    <div>Total balance:</div>
                    <div>{balanceText}</div>
                </>
            }
        </div>
    );
};

export default GraphNode