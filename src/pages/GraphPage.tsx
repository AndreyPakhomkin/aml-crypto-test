import React, { useEffect } from "react";
import { useGetDataMutation } from "../entities/graphApi";

const GraphPage: React.FC = () => {
    const [getData] = useGetDataMutation();

    useEffect(() => {
        getData()
    }, [])

    return (
        <>куку</>
    )
}

export default GraphPage