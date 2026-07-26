type GraphNode = {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;

};
type GraphEdge = {
    from: string;
    to: string;
    label: string;
};
type GraphCanvasProps ={
    activeStep : number ;
    startNode: string ;
    activeEdge:string ;
    resultNode: string ;
};

const nodes: GraphNode[] = [
    { id: "ravi", name: "Ravi", type: "person", x: 170, y: 265 },
    {
        id: "northflow",
        name: "NorthFlow",
        type: "company",
        x: 390,
        y: 155,
    },
    {
        id: "city-clinic",
        name: "City Clinic",
        type: "client",
        x: 620,
        y: 265,
    },

];
const edges: GraphEdge[] = [
    { from: "ravi", to: "northflow", label: "founded" },
    { from: "northflow", to: "city-clinic", label: "serves" },
];
function GraphCanvas({
    activeStep,
    startNode ,
    activeEdge,
    resultNode,
}:GraphCanvasProps) {
    const activeNode = activeStep === 0 ? startNode : activeStep === 2 ? resultNode :null ;
    return (
        <svg
            viewBox="0 0 800 480"
            role="img"
            aria-label="Pathglass demo graph"
        >
            {edges.map((edge) => {
                const start = nodes.find((node) => node.id === edge.from);
                const end = nodes.find((node) => node.id === edge.to);
                if (!start || !end) {
                    return null;
                }
                const middleX = (start.x + end.x) / 2 ;
                const middleY = (start.y + end.y) / 2 ;
                const isActive = 
                edge.label === activeEdge && activeStep === 1;

                return (
                    <g 
                        className={isActive ? "active-edge":undefined}
                        key={`${edge.from}-${edge.to}`}
                     >
                        <line
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                        />
                        <text
                            className="edge-name"
                            x ={middleX}
                            y ={middleY}
                            
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {edge.label}
                        </text>
                    </g>

                );
            })}
            {nodes.map((node) => (
                <g
                    className={node.id === activeNode ? "active-node" : undefined}
                    key={node.id}
                    transform={`translate(${node.x} ${node.y})`}
                >
                    <circle r="38" />
                    <text y="5">{node.name}</text>
                    <text className="node-type" y="58">
                        {node.type}
                    </text>
                </g>
            ))}
        </svg>
    );
}
export default GraphCanvas;  