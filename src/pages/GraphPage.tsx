import React, { useEffect } from "react";
import { useGetDataMutation } from "../entities/graphApi";
import GraphViewer from "../widgets/GraphViewer/GraphViewer";

const GraphPage: React.FC = () => {
    const [getData] = useGetDataMutation();

    useEffect(() => {
        getData()
    }, [])

    return (
        <GraphViewer />
    )
}

export default GraphPage