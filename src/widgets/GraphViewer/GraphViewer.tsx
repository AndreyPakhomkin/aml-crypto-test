import React, { useEffect, useMemo, useRef } from "react";
import { IGraphLink, IGraphNode } from "../../entities/types";
import { useAppSelector } from "../../shared/hooks/storeHooks";
import { simulation } from "../simulation";
import { forceCenter, forceCollide, forceLink } from "d3-force";
import { drag, D3DragEvent } from "d3-drag";
import { select } from "d3-selection";
import { createRoot } from "react-dom/client";
import GraphNode from "../../shared/ui/GraphNode";
import "./GraphViewer.scss";

const GraphViewer: React.FC = () => {
    const width = 720;
    const height = 720;
    const center = { x: width / 2, y: height / 2 };
    const startRadius = 30;

    const { nodes, links } = useAppSelector((state) => state.storedData.data)
    const svgRef = useRef<SVGSVGElement>(null);

    const mutableNodes = useMemo(() =>
        nodes.map((node, i) => ({
            ...node,
            x: center.x + (Math.random() - 0.5) * 10,
            y: center.y + (Math.random() - 0.5) * 10
        })),
        [nodes]);

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
        if (!svgRef.current) return;

        simulation
            .nodes(mutableNodes)
            .force("link",
                forceLink<IGraphNode, IGraphLink>(filledLinks)
                    .id((d) => d.id)
                    .distance(70)
            )
            .force("collide", forceCollide(startRadius * 0.1))
            .force("center", forceCenter(center.x, center.y).strength(0.01))
            .alphaDecay(0.02);

        const svg = select(svgRef.current);

        const linkSelection = svg
            .selectAll<SVGLineElement, IGraphLink>("line")
            .data(filledLinks)
            .join("line")
            .classed("link-line", true);

        const nodesSelection = svg
            .selectAll<SVGCircleElement, IGraphNode>("circle")
            .data(mutableNodes)
            .join("circle")
            .classed("node-circle", true);

        const dragBehavior = drag<SVGCircleElement, IGraphNode>()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);

        nodesSelection.call(dragBehavior);

        simulation.on("tick", () => {
            linkSelection
                .attr("x1", (d) => d.source.x!)
                .attr("y1", (d) => d.source.y!)
                .attr("x2", (d) => d.target.x!)
                .attr("y2", (d) => d.target.y!);

            nodesSelection
                .attr("cx", (d) => d.x!)
                .attr("cy", (d) => d.y!);
        });

    }, [nodes, filledLinks])

    const dragStarted = (event: D3DragEvent<SVGCircleElement, IGraphNode, IGraphNode>) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    const dragged = (event: D3DragEvent<SVGCircleElement, IGraphNode, IGraphNode>) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    const dragEnded = (event: D3DragEvent<SVGCircleElement, IGraphNode, IGraphNode>) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return (
        <div className="container">
            <svg width={width} height={height} ref={svgRef}></svg>
        </div>
    )
}

export default GraphViewer