import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IGraphNode } from "../../entities/types";
import { useAppSelector } from "../../shared/hooks/storeHooks";
import { zoom, ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";
import "./GraphViewer.scss";
import calcNodePositions from "../../shared/utils/calcNodePositions";
import useGraphSimulation from "../../shared/hooks/useGraphSimulation";
import Tools from "../Tools/Tools";
import CurrencySwitch from "../../shared/ui/CurrencySwitch/CurrencySwitch";
import CollapseSwitch from "../../shared/ui/ClasterSwitch/CollapseSwitch";

const GraphViewer: React.FC = () => {
    const width = 1440;
    const height = 720;

    const { nodes, links } = useAppSelector((state) => state.storedData.data);
    const { centerNodes, displayCurrency } = useAppSelector((state) => state.storedData);
    const svgRef = useRef<SVGSVGElement>(null);
    const existingNodes = useRef(new Map<IGraphNode["id"], IGraphNode>());
    const simulationNodesRef = useRef<IGraphNode[]>([]);

    const mutableNodes = useMemo(() => {
        console.log(centerNodes)
        return calcNodePositions({
            nodes,
            existingNodes: existingNodes.current,
            links,
            centerNodes
        });
    }, [nodes, links, centerNodes]);

    const filledLinks = useMemo(() => {
        const nodesMap = new Map(mutableNodes.map((node) => [node.id, node]));

        return links.map((link) => ({
            source: nodesMap.get(link.source as string)!,
            target: nodesMap.get(link.target as string)!,
            strength: 0,
            label: link.label,
            usdt_amount: link.usdt_amount,
            tokens_amount: link.tokens_amount,
        }));
    }, [nodes, links, mutableNodes]);

    const updateExistingNodesFromSimulation = useCallback(() => {
        const currentNodes = simulationNodesRef.current;
        if (currentNodes && currentNodes.length > 0) {
            currentNodes.forEach(simNode => {
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
    }, [existingNodes]);

    const { groupRef, simulationNodes } = useGraphSimulation({
        nodes: mutableNodes,
        links: filledLinks,
        displayCurrency: displayCurrency,
        updateNodes: updateExistingNodesFromSimulation,
        centerNodes
    });

    useEffect(() => {
        simulationNodesRef.current = simulationNodes;
    }, [simulationNodes]);

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
            <div className="graph-container">
                <CurrencySwitch displayCurrency={displayCurrency} />
                <CollapseSwitch />
                <svg
                    width={width}
                    height={height}
                    ref={svgRef}
                    viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
                >
                    <g ref={groupRef}></g>
                </svg>
            </div>
            <Tools updateNodes={updateExistingNodesFromSimulation} />
        </div>
    );
};

export default GraphViewer;