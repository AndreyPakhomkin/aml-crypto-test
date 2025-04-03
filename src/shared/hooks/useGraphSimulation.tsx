import { useEffect, useRef } from "react";
import { forceCollide, forceLink, forceManyBody, forceSimulation } from "d3-force";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { createRoot } from "react-dom/client";
import { IGraphLink, IGraphNode } from "../../entities/types";
import GraphNode from "../../shared/ui/GraphNode/GraphNode";
import { setSelectedNodeId } from "../../entities/graphSlice";
import { useAppDispatch } from "./storeHooks";

interface UseGraphSimulationProps {
    nodes: IGraphNode[];
    links: IGraphLink[];
}

const typeToColor = {
    user: 'rgb(66, 139, 212)',
    bridge: 'rgb(40, 97, 153)',
    cex: 'rgb(69, 162, 255)',
};

const RADIUS = 31;

const simulation = forceSimulation<IGraphNode, IGraphLink>()
    .force("collision", forceCollide(RADIUS * 1))

const useGraphSimulation = ({ nodes, links }: UseGraphSimulationProps) => {
    const dispatch = useAppDispatch();
    const groupRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!groupRef.current) return;

        const g = select(groupRef.current);

        simulation.nodes(nodes);

        simulation
            .force(
                "link",
                forceLink<IGraphNode, IGraphLink>(links)
                    .id((d) => d.id)
                    .distance(300)
            )
            .alpha(0.2)
            .restart();

        const linkSelection = g
            .selectAll<SVGLineElement, IGraphLink>("line")
            .data(links)
            .join("line")
            .classed("link-line", true);

        const linksLabelSelection = g
            .selectAll<SVGTextElement, IGraphLink>("text.link-label")
            .data(links)
            .join("text")
            .classed("link-label", true)
            .attr("dy", -5)
            .text((d) => (d.usdt_amount ? `${Math.trunc(d.usdt_amount)} USDT` : ""));

        const nodesSelection = g
            .selectAll<SVGForeignObjectElement, IGraphNode>("foreignObject.node")
            .data(nodes)
            .join("foreignObject")
            .classed("node", true)
            .attr("style", (d) => `background-color: ${typeToColor[d.type] || "gray"}`)
            .on("click", function (event, d: IGraphNode) {
                dispatch(setSelectedNodeId(d.id));
            })
            .each(function (node) {
                const root = createRoot(this);
                root.render(<GraphNode node={node} />);
            });

        const gNode = g.node();
        const firstNode = g.select<SVGForeignObjectElement>("foreignObject.node").node();

        if (gNode && firstNode) {
            g.selectAll<SVGLineElement, IGraphLink>("line").each(function () {
                gNode.insertBefore(this, firstNode);
            });
        }

        const dragBehavior = drag<SVGForeignObjectElement, IGraphNode>()
            .on("start", (event) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            })
            .on("drag", (event) => {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            })
            .on("end", (event) => {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            });

        nodesSelection.call(dragBehavior);

        simulation.on("tick", () => {
            linkSelection
                .attr("x1", (d: IGraphLink) => (d.source as IGraphNode).x!)
                .attr("y1", (d: IGraphLink) => (d.source as IGraphNode).y!)
                .attr("x2", (d: IGraphLink) => (d.target as IGraphNode).x!)
                .attr("y2", (d: IGraphLink) => (d.target as IGraphNode).y!);

            linksLabelSelection
                .attr("x", (d: IGraphLink) => ((d.source as IGraphNode).x! + (d.target as IGraphNode).x!) / 2)
                .attr("y", (d: IGraphLink) => ((d.source as IGraphNode).y! + (d.target as IGraphNode).y!) / 2);

            nodesSelection.attr("transform", (d) => `translate(${d.x! - 60}, ${d.y! - 30})`);
        });
    }, [nodes, links, simulation]);

    return { groupRef };
};

export default useGraphSimulation;