import { IGraphNode } from "../../../entities/types";

interface GraphNodeProps {
    node: IGraphNode;
}

const GraphNode: React.FC<GraphNodeProps> = ({ node }) => {
    return (
        <div className="node-content">
            <div>Id: {node.id}</div>
            <div>Name: {node.name ? `${node.name}` : `unknown`}</div>
            {node.usdt_balance !== undefined && <div>Balance: {Math.trunc(node.usdt_balance)} USDT</div>}
        </div>
    );
};

export default GraphNode