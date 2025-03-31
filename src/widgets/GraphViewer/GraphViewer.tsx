import React, { useEffect, useMemo, useRef } from "react";
import { IGraphLink, IGraphNode } from "../../entities/types";
import { useAppSelector } from "../../shared/hooks/storeHooks";
import { simulation } from "../simulation";
import { forceLink } from "d3-force";
import { drag, D3DragEvent } from "d3-drag";
import { select } from "d3-selection";
import "./GraphViewer.scss";
import AdressInput from "../../shared/ui/AdressInput/AdressInput";

const GraphViewer: React.FC = () => {
    const width = 1440;
    const height = 720;

    const { nodes, links } = useAppSelector((state) => state.storedData.data)
    const svgRef = useRef<SVGSVGElement>(null);

    const existingNodes = useRef(new Map<IGraphNode["id"], IGraphNode>());

    const mutableNodes = useMemo(() => {
        return nodes.map((node) => {
            if (existingNodes.current.has(node.id)) {
                return existingNodes.current.get(node.id)!;
            }

            const relatedLinks = links.filter(link => link.source === node.id || link.target === node.id);

            const mainNode = relatedLinks
                .map(link => existingNodes.current.get(link.source as string) ?? existingNodes.current.get(link.target as string))
                .find(Boolean);

            let x = (Math.random() - 0.5) * 10;
            let y = (Math.random() - 0.5) * 10;

            if (mainNode) {
                let incoming = 0, outgoing = 0;

                relatedLinks.forEach(link => {
                    const tokensSum = (link.tokens_amount || []).reduce((sum, token) => sum + (token.usdt_amount || 0), 0);
                    const totalAmount = (link.usdt_amount || 0) + tokensSum;

                    if (link.target === node.id) incoming += totalAmount;
                    if (link.source === node.id) outgoing += totalAmount;
                });

                x = mainNode.x! + (incoming >= outgoing ? 100 : -100);
                y = mainNode.y! + (Math.random() - 0.5) * 50;
            }

            const newNode = { ...node, x, y };
            existingNodes.current.set(node.id, newNode);
            return newNode;
        });
    }, [nodes, links]);


    const filledLinks = useMemo(() => {
        const nodesMap = new Map(mutableNodes.map((node) => [node.id, node]));

        return links.map((link) => ({
            source: nodesMap.get(link.source as string)!,
            target: nodesMap.get(link.target as string)!,
            strength: -50,
            label: link.label,
            usdt_amount: link.usdt_amount,
            tokens_amount: link.tokens_amount
        }));
    }, [nodes, links])

    useEffect(() => {
        simulation.nodes(mutableNodes);
        console.log(nodes)
    }, [nodes]);


    useEffect(() => {
        if (!svgRef.current) return;

        simulation
            .nodes(mutableNodes)
            .force("link", forceLink<IGraphNode, IGraphLink>(filledLinks).id((d) => d.id).distance(150))
            .alpha(0.2)
            .restart();

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
        <div className="page-container">
            <svg width={width} height={height} ref={svgRef} viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}></svg>
            <AdressInput />
        </div>
    )
}

export default GraphViewer