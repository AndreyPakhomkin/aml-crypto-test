import { IGraphLink } from "../../entities/types";

const LINK_DISTANCE = 300;
const LINK_LENGTH_MULTIPLIER = 2;

export const calcLinkDistance = (link: IGraphLink, allLinks: IGraphLink[]) => {
    const sourceLinksCount = allLinks.filter(l => l.source === link.source || l.target === link.source).length;
    const targetLinksCount = allLinks.filter(l => l.source === link.target || l.target === link.target).length;

    if (sourceLinksCount > 1 && targetLinksCount > 1) {
        return LINK_DISTANCE * LINK_LENGTH_MULTIPLIER;
    }
    return LINK_DISTANCE;
};