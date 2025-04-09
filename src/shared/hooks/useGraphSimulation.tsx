import { useEffect, useRef } from "react";
import { forceCollide, forceLink, forceManyBody, forceSimulation } from "d3-force";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { createRoot } from "react-dom/client";
import { IGraphLink, IGraphNode } from "../../entities/types";
import GraphNode from "../../shared/ui/GraphNode/GraphNode";
import { setSelectedNodeId } from "../../entities/graphSlice";
import { useAppDispatch } from "./storeHooks";
import { defineShowingCurrency } from "../utils/defineShowingCurrency";
import { useGetDataMutation } from "../../entities/graphApi";

interface UseGraphSimulationProps {
    nodes: IGraphNode[];
    links: IGraphLink[];
    displayCurrency: 'usdt' | 'tokens';
    updateNodes: () => void;
}

const typeToColor = {
    user: 'rgb(66, 139, 212)',
    bridge: 'rgb(40, 97, 153)',
    cex: 'rgb(69, 162, 255)',
};

const RADIUS = 31;

const rootsMap = new WeakMap<Element, ReturnType<typeof createRoot>>();

const simulation = forceSimulation<IGraphNode, IGraphLink>()
    .force("collision", forceCollide(RADIUS * 1.1))

const useGraphSimulation = ({ nodes, links, displayCurrency, updateNodes }: UseGraphSimulationProps) => {
    const dispatch = useAppDispatch();
    const groupRef = useRef<SVGGElement>(null);
    const [getData] = useGetDataMutation();

    useEffect(() => {
        if (!groupRef.current) return;

        const g = select(groupRef.current);

        simulation.nodes(nodes);

        simulation
            .force("link",
                forceLink<IGraphNode, IGraphLink>(links)
                    .id((d) => d.id)
                    .distance(350)
                    .strength(0)
            )
            .force("charge", forceManyBody().strength(0))
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
            .text((d) => defineShowingCurrency(displayCurrency, d));

        const nodesSelection = g
            .selectAll<SVGForeignObjectElement, IGraphNode>("foreignObject.node")
            .data(nodes)
            .join("foreignObject")
            .classed("node", true)
            .attr("style", (d) => `background-color: ${typeToColor[d.type] || "gray"}`)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on("click", function (event, d: IGraphNode) {
                dispatch(setSelectedNodeId(d.id));
            })
            .on("dblclick", function (event, d: IGraphNode) {
                event.stopPropagation();
                updateNodes();
                getData({ adress: d.id });
            })
            .each(function (node) {
                let root = rootsMap.get(this);
                if (!root) {
                    root = createRoot(this);
                    rootsMap.set(this, root);
                }
                root.render(<GraphNode node={node} />);
            });

        const gNode = g.node();
        const firstNode = g.select<SVGForeignObjectElement>("foreignObject.node").node();

        if (gNode && firstNode) {
            g.selectAll<SVGLineElement, IGraphLink>("line").each(function () {
                gNode.insertBefore(this, firstNode);
            });

            g.selectAll<SVGTextElement, IGraphLink>("text.link-label").each(function () {
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
            });

        nodesSelection.call(dragBehavior);

        simulation.on("tick", () => {
            linkSelection
                .attr("x1", (d) => (d.source as IGraphNode).x!)
                .attr("y1", (d) => (d.source as IGraphNode).y!)
                .attr("x2", (d) => (d.target as IGraphNode).x!)
                .attr("y2", (d) => (d.target as IGraphNode).y!);

            linksLabelSelection
                .attr("x", (d) => ((d.source as IGraphNode).x! + (d.target as IGraphNode).x!) / 2)
                .attr("y", (d) => ((d.source as IGraphNode).y! + (d.target as IGraphNode).y!) / 2)
                .attr("transform", (d: IGraphLink) => {
                    const x1 = (d.source as IGraphNode).x!;
                    const y1 = (d.source as IGraphNode).y!;
                    const x2 = (d.target as IGraphNode).x!;
                    const y2 = (d.target as IGraphNode).y!;

                    const cx = (x1 + x2) / 2;
                    const cy = (y1 + y2) / 2;
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                    return `rotate(${angle}, ${cx}, ${cy})`;
                });

            nodesSelection.attr("transform", (d) => `translate(${d.x! - 60}, ${d.y! - 30})`);
        });

        simulation.alphaTarget(0);
    }, [nodes, links, displayCurrency, updateNodes, getData]);

    return { groupRef, simulationNodes: nodes };
};

export default useGraphSimulation;