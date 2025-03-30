import { forceSimulation, forceManyBody, forceCollide } from "d3-force";
import { IGraphLink, IGraphNode } from "../entities/types";

const RADIUS = 10;
// const LINK_DISTANCE = 90;
const FORCE_RADIUS_FACTOR = 2;
const NODE_STRENGTH = -100;

export const simulation = forceSimulation<IGraphNode, IGraphLink>()
    .force("charge", forceManyBody().strength(NODE_STRENGTH))
    .force("collision", forceCollide(RADIUS * FORCE_RADIUS_FACTOR))