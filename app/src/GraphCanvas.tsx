import type { GraphEdge, GraphNode } from "./graphData";

type GraphCanvasProps ={
    nodes: GraphNode[];
    edges: GraphEdge[];
    activeStage : ReplayStage ;
    startNode: string ;
    activeEdge:string ;
    resultNodes: string[] ;
};

export type ReplayStage = "start" | "edge" | "take" | "result" ;

function GraphCanvas({
    nodes,
    edges,
    activeStage,
    startNode ,
    activeEdge,
    resultNodes,
}:GraphCanvasProps) {
    const activeNodes = activeStage === "start" ? [startNode] : activeStage === "result" ? resultNodes :[] ;
    return (
        <svg
            viewBox="0 0 800 480"
            role="img"
            aria-label="Pathglass graph canvas"
        >
            {nodes.length === 0 && (
                <text className="empty-graph" x ="400" y="240">
                    Add your first vertex
                </text>
            )}
            {edges.map((edge) => {
                const start = nodes.find((node) => node.id === edge.from);
                const end = nodes.find((node) => node.id === edge.to);
                if (!start || !end) {
                    return null;
                }
                const middleX = (start.x + end.x) / 2 ;
                const middleY = (start.y + end.y) / 2 ;
                const isActive = 
                edge.label === activeEdge && activeStage === "edge";

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
                    className={ activeNodes.includes(node.id) ? "active-node" : undefined}
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