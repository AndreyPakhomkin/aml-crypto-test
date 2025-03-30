interface INodeProps {
    name: string
}

const Node: React.FC<INodeProps> = ({ name }) => {
    return (
        <div className=" bg-blue-300 rounded-full border border-blue-800 px-2">
            {name}
        </div>
    )
}

export default Node