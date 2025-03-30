import React, { useEffect, useMemo, useRef } from "react";
import { IGraphLink, IGraphNode } from "../entities/types";
import { useAppSelector } from "../shared/hooks/storeHooks";
import { simulation } from "./simulation";
import { forceCenter, forceLink } from "d3-force";
import { select } from "d3-selection";
import { createRoot } from "react-dom/client";
import Node from "../shared/ui/Node";

// interface GraphViewerProps {
//     width: number,
//     height: number
// }

const GraphViewer: React.FC = () => {
    const width = 1400;
    const height = 720;

    const { nodes, links } = useAppSelector((state) => state.storedData.data)
    const svgRef = useRef<SVGSVGElement>(null);

    const mutableNodes = useMemo(() => {
        return nodes.map((node) => ({ ...node }));
    }, [nodes]);

    const filledLinks = useMemo(() => {
        const nodesMap = new Map(mutableNodes.map((node) => [node.id, node]));

        return links.map((link) => ({
            source: nodesMap.get(link.source as string)!,
            target: nodesMap.get(link.target as string)!,
            strength: -100,
            label: link.label,
            usdt_amount: link.usdt_amount,
            tokens_amount: link.tokens_amount
        }));
    }, [nodes, links])

    useEffect(() => {
        simulation.nodes(mutableNodes);
    }, [nodes]);

    useEffect(() => {
        simulation
            .nodes(mutableNodes)
            .force(
                "link",
                forceLink<IGraphNode, IGraphLink>(filledLinks)
                    .id((d) => d.id)
                    .distance(100)
            )
            .force("center", forceCenter(width / 2, height / 2).strength(0.05));

        const linkSelection = select(svgRef.current)
            .selectAll("line.link")
            .data(filledLinks)
            .join("line")
            .classed("link", true)
            .attr("stroke-width", d => d.strength)
            .attr("stroke", "black")

        const nodesSelection = select(svgRef.current)
            .selectAll("foreignObject.node")
            .data(mutableNodes)
            .join("foreignObject")
            .classed("node", true)
            .attr("width", 1)
            .attr("height", 1)
            .attr("overflow", "visible")

        nodesSelection?.each(function (node) {
            const root = createRoot(this as SVGForeignObjectElement);
            root.render(
                <div className="z-20 w-max -translate-x-1/2 -translate-y-1/2">
                    <Node name={node.name} />
                </div>
            )
        })

        simulation.on("tick", () => {
            linkSelection
                .attr("x1", (d) => d.source.x!)
                .attr("y1", (d) => d.source.y!)
                .attr("x2", (d) => d.source.x!)
                .attr("y2", (d) => d.source.y!)

            nodesSelection
                .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
        })

    }, [nodes, filledLinks])

    return (
        <svg width={width} height={height} ref={svgRef}></svg>
    )
}

export default GraphViewer