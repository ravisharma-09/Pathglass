import { Query } from "./query" ;
export type  properties = Record<string, unknown>  ; 
export interface Vertex{
    readonly id:string;
    readonly properties:properties;

}
export interface edge{
    readonly source:string ;
    readonly target:string ;
    readonly label:string ;
    readonly properties:properties ;
}
export class Graph{
    private readonly vertices = new Map<string,Vertex>();
    private readonly edges: edge[] = [] ;
    private readonly outgoingEdges =  new Map<string,edge[]>() ;
    private readonly incomingEdges = new Map<string,edge[]>() ;

    v(...vertexIds: string[]): Query{
        return new Query(vertexIds) ;
    }

    addVertex(id:string,properties: properties = {} ): Vertex{
        const  cleanId = id.trim() ;


        if (!cleanId) {
            throw new Error('Vertex needs a valid id');
        }
        if (this.vertices.has(cleanId)){
            throw new Error(`Vertex with id ${cleanId} already exists`) ;

        }
        const vertex : Vertex = {
           id :  cleanId,
           properties : {...properties},

        };   
        this.vertices.set(cleanId,vertex);
        this.outgoingEdges.set(cleanId,[]) ;
        this.incomingEdges.set(cleanId,[]) ;
        return vertex;


    }
    addEdge(
        sourceId:string,
        targetId:string,
        label:string,
        properties:properties={},
    ):edge{
        const source = sourceId.trim();
        const target = targetId.trim() ;
        const cleanLabel = label.trim() ;
        if (!this.vertices.has(source)){
            throw new Error(`Source vertex with id ${source} does not exist`) ;
        }
        if (!this.vertices.has(target)){
            throw new Error(`Target vertex with id ${target} does not exist`) ;
        }
        if (!cleanLabel){
            throw new Error("Edge needs a valid label") ;

        }
        const relationship:edge ={
            source,
            target,
            label:cleanLabel,
            properties:{...properties}, 

        }
        this.edges.push(relationship) ;
        this.outgoingEdges.get(source)!.push(relationship) ;
        this.incomingEdges.get(target)!.push(relationship) ;
        return relationship ;

    }
    getVertex(id:string):Vertex | undefined{
        return this.vertices.get(id) ;
    }
    getOutgoingEdges(vertexId:string):edge[]{
        const edges = this.outgoingEdges.get(vertexId.trim()) ;
        return edges ? [...edges] : [] ;
    }
    getIncomingEdges(vertexId:string):edge[]{
        const edges = this.incomingEdges.get(vertexId.trim()) ;
        return edges ? [...edges] : [] ;
    }

    get size():number{
        return this.vertices.size ;
    }
    get edgeCount(): number{
        return this.edges.length ;

    }
} 