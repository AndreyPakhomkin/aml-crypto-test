import { Box, Button, TextField, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks/storeHooks";
import { useEffect, useState } from "react";
import { IGraphNode } from "../../../entities/types";
import "./AdressData.scss";

interface IAgents {
    receivers: string[],
    senders: string[]
}

const AdressData: React.FC = () => {
    const { nodes, links } = useAppSelector((state) => state.storedData.data);
    const { selectedNodeId } = useAppSelector((state) => state.storedData);
    const [selectedNode, setSelectedNode] = useState<IGraphNode | null>(null);
    const [agents, setAgents] = useState<IAgents | null>(null);


    useEffect(() => {
        setSelectedNode(nodes.find((node) => node.id === selectedNodeId) || null)
        const linksTo = links.filter((link) => link.source === selectedNodeId);
        const linksFrom = links.filter((link) => link.target === selectedNodeId);

        const receivers = linksTo.map((link) => link.target as string);
        const senders = linksFrom.map((link) => link.source as string);

        setAgents({
            receivers: receivers,
            senders: senders
        })
    }, [selectedNodeId])

    if (selectedNodeId.length !== 0) {
        return (
            <Box
                component="section"
                className="adress-data-container"
            >
                <Box className="adress-data-title">
                    <div>Adress: {selectedNode?.id}</div>
                </Box>
                <Box
                    className="adress-data-agents"
                >
                    <div className="adress-data-agents-senders">
                        <div>Senders: </div>
                        {agents?.senders.map((sender) => (
                            <div key={`sender key ${sender}`}>{sender}</div>
                        ))}
                    </div>

                    <div className="adress-data-agents-receivers">
                        <div>Receivers: </div>
                        {agents?.receivers.map((receiver) => (
                            <div key={`receiver key ${receiver}`}>{receiver}</div>
                        ))}
                    </div>
                </Box>
            </Box>
        );
    }
    return null
};

export default AdressData;
