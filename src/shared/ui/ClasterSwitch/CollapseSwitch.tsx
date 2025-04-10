import { Switch, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { setCenterNodeCollapse } from "../../../entities/graphSlice";
import "./CollapseSwitch.scss";
import { findRelatedNodes } from "../../utils/findRelatedNodes";

const CollapseSwitch: React.FC = () => {
    const dispatch = useAppDispatch();
    const { centerNodes, selectedNodeId } = useAppSelector((state) => state.storedData);
    const { links, nodes } = useAppSelector((state) => state.storedData.data);

    const currentNode = centerNodes[selectedNodeId];
    const isCollapsible = Boolean(currentNode);
    const isCollapsed = currentNode?.isCollapsed ?? false;

    const handleChange = () => {
        if (!selectedNodeId) return;

        if (!isCollapsed) {
            const { relatedNodesId, groupBalance } = findRelatedNodes(
                selectedNodeId,
                links,
                centerNodes,
                nodes
            );

            dispatch(setCenterNodeCollapse({
                nodeId: selectedNodeId,
                isCollapsed: true,
                nodesToHide: relatedNodesId,
                groupBalance,
            }));
        } else {
            dispatch(setCenterNodeCollapse({
                nodeId: selectedNodeId,
                isCollapsed: false,
                nodesToHide: [],
                groupBalance: 0,
            }));
        }
    };

    return (
        <div className="collapse-switch-container">
            <Typography>Collapse node</Typography>
            <Switch
                checked={isCollapsed}
                size="small"
                disabled={!isCollapsible}
                onChange={handleChange}
            />
        </div>
    );
};

export default CollapseSwitch;