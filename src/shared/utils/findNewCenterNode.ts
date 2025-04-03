import { IGraphLink } from "../../entities/types";

export const findNewCenterNode = (links: IGraphLink[]) => {
    const nodes = links.flatMap(link => [link.source as string, link.target as string]);

    for (let nodeId of nodes) {
        const isCenter = links.every(link => link.source === nodeId || link.target === nodeId);
        if (isCenter) {
            return nodeId;
        }
    }
}