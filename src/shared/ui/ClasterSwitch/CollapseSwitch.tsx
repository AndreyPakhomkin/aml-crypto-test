import { Switch, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { setCenterNodeCollapse } from "../../../entities/graphSlice";
import "./CollapseSwitch.scss";

const CollapseSwitch: React.FC = () => {
    const dispatch = useAppDispatch();
    const { centerNodes, selectedNodeId } = useAppSelector((state) => state.storedData);

    const currentNode = centerNodes[selectedNodeId];
    const isCollapsible = Boolean(currentNode);
    const isCollapsed = currentNode?.isCollapsed ?? false;

    const handleChange = () => {
        dispatch(setCenterNodeCollapse({
            nodeId: selectedNodeId,
            isCollapsed: !isCollapsed,
        }));
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