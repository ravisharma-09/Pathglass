import type {Graph, Vertex} from "./graph" ;

export interface vertexStep{
    readonly kind: "vertex" ;
    readonly ids : readonly string[] ;

}
export interface outStep{
    readonly kind:"out" ;
    readonly label: string ;
}
export interface inStep{
    readonly kind : "in" ;
    readonly label: string ;
}

export type queryStep = vertexStep | outStep | inStep;
export class Query {
    private readonly steps: queryStep[] = [] ;
    constructor(
        private readonly graph : Graph,
        vertexIds: string[],
    ){
        this.steps.push({
            kind: "vertex",
            ids: vertexIds.map((id)=> id.trim()),
        }) ;
    }
    out(label: string) : this {
        this.steps.push({
            kind:"out",
            label: label.trim(),
        }) ;
        return this ;
    
      
    }
    in(label:string):this{
        this.steps.push({
            kind:"in",
            label:label.trim(),
        }) ;
        return this ;
    }
    run(): Vertex[] {
        const firstStep = this.steps[0] ;
        if (!firstStep || firstStep.kind !== "vertex"){
            return [];
        }

        let results: Vertex[] = [] ;
        for (const id of firstStep.ids){
            const vertex = this.graph.getVertex(id) ;
            if (vertex){
                results.push(vertex);
            }
        }
        for (const step of this.steps.slice(1)){
            const nextResults: Vertex[] = [] ;
            if (step.kind === "out"){
               for (const vertex of results) {
                const edges = this.graph.getOutgoingEdges(vertex.id);
                for(const edge of edges){
                    if (edge.label !== step.label){
                        continue ;

                    }
                    const target = this.graph.getVertex(edge.target);

                    if (target){
                        nextResults.push(target) ;
                    }
                }
            }
        }
           if(step.kind === "in"){
            for (const vertex of results){
                const edges = this.graph.getIncomingEdges(vertex.id);

                for(const edge of edges){
                    if (edge.label !== step.label){
                        continue ;
                    }
                    const source = this.graph.getVertex(edge.source);
                    if (source){
                        nextResults.push(source);
                    }
                }
            }
           }
           results = nextResults ;
        }

        return results ; 
    }
    getPlan():queryStep[]{
        return this.steps.map((step)=>{
           if (step.kind === "vertex"){
           return { ...step,
            ids:[...step.ids],
        };
        }
        return {...step} ;
    }) ;
    }
}
