import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IGraphNode } from "../../entities/types";
import { useAppSelector } from "../../shared/hooks/storeHooks";
import { zoom, ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";
import "./GraphViewer.scss";
import calcNodePositions from "../../shared/utils/calcNodePositions";
import useGraphSimulation from "../../shared/hooks/useGraphSimulation";
import Tools from "../Tools/Tools";
import { useAppDispatch } from "../../shared/hooks/storeHooks";

const GraphViewer: React.FC = () => {
    const width = 1440;
    const height = 720;

    const { nodes, links } = useAppSelector((state) => state.storedData.data);
    const { centerNodes } = useAppSelector((state) => state.storedData);
    const svgRef = useRef<SVGSVGElement>(null);
    const existingNodes = useRef(new Map<IGraphNode["id"], IGraphNode>());

    const mutableNodes = useMemo(() => {

        console.log(1, existingNodes)
        return calcNodePositions({
            nodes,
            existingNodes: existingNodes.current,
            links,
            centerNodes
        }).map((node) => {
            existingNodes.current.set(node.id, node);
            return { ...node };
        });
    }, [nodes, links]);

    const filledLinks = useMemo(() => {
        const nodesMap = new Map(mutableNodes.map((node) => [node.id, node]));

        return links.map((link) => ({
            source: nodesMap.get(link.source as string)!,
            target: nodesMap.get(link.target as string)!,
            strength: -100,
            label: link.label,
            usdt_amount: link.usdt_amount,
            tokens_amount: link.tokens_amount,
        }));
    }, [nodes, links, mutableNodes]);

    const { groupRef, simulationNodes } = useGraphSimulation({
        nodes: mutableNodes,
        links: filledLinks
    });

    const updateExistingNodesFromSimulation = useCallback(() => {
        if (simulationNodes) {
            simulationNodes.forEach(simNode => {
                const existingNode = existingNodes.current.get(simNode.id);
                if (existingNode) {
                    existingNodes.current.set(simNode.id, {
                        ...existingNode,
                        x: simNode.x,
                        y: simNode.y,
                        fx: simNode.x,
                        fy: simNode.y
                    });
                }
            });
        }
    }, [simulationNodes, existingNodes]);

    useEffect(() => {
        if (!svgRef.current || !groupRef.current) return;

        const svg = select(svgRef.current);
        const g = select(groupRef.current);

        const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<SVGSVGElement, unknown>()
            .extent([
                [0, 0],
                [width, height],
            ])
            .scaleExtent([0.1, 5])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoomBehavior);
    }, [width, height]);

    return (
        <div className="page-container">
            <svg
                width={width}
                height={height}
                ref={svgRef}
                viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
            >
                <g ref={groupRef}></g>
            </svg>
            <Tools updateNodes={updateExistingNodesFromSimulation} />
        </div>
    );
};

export default GraphViewer;