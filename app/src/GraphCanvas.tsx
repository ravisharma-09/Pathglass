import type { GraphEdge, GraphNode } from "./graphData";

type GraphCanvasProps ={
    nodes: GraphNode[];
    edges: GraphEdge[];
    activeStage : ReplayStage ;
    startNode: string ;
    activeEdge:string ;
    resultNodes: string[] ;
    selectedNode: string | null ;
    selectedEdge: string | null ;
    onSelectNode: (id:string) => void ;
    onSelectEdge: (key:string) => void ;
};

export type ReplayStage = "start" | "edge" | "take" | "result" ;

function GraphCanvas({
    nodes,
    edges,
    activeStage,
    startNode ,
    activeEdge,
    resultNodes,
    selectedNode,
    selectedEdge,
    onSelectNode,
    onSelectEdge,
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
                activeStage === "edge" &&
                edge.from === startNode &&
                edge.label === activeEdge ;
                const edgeKey = `${edge.from}|${edge.label}|${edge.to}` ;
                const edgeClass = [ 
                    isActive ? "active-edge" : "",
                    edgeKey === selectedEdge ? "selected-edge" : "",
                ]
                .filter(Boolean)
                .join(" ");

                return (
                    <g 
                        className={edgeClass}
                        key={edgeKey}
                        onClick={() => onSelectEdge(edgeKey)}
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
            {nodes.map((node) => {
                
                const nodeClass = [
                    activeNodes.includes(node.id) ? "active-node" : "",
                    node.id === selectedNode ? "selected-node" : "",
                ]
                .filter(Boolean)
                .join(" ");
                return (
                    <g  key={node.id}
                        className={nodeClass}
                        transform={`translate(${node.x} ${node.y})`}
                        onClick={() => onSelectNode(node.id)}
                    >   
                        <circle r="38" />
                        <text y="5">{node.name}</text>
                        <text className="node-type" y="58">
                            {node.type}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
export default GraphCanvas;  
                            
           