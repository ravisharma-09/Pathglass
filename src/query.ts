import { takeFrom } from "./lazy";
import type { Graph, Vertex, properties } from "./graph";

export interface vertexStep {
    readonly kind: "vertex";
    readonly ids: readonly string[];

}
export interface outStep {
    readonly kind: "out";
    readonly label: string;
}
export interface inStep {
    readonly kind: "in";
    readonly label: string;
}
export interface uniqueStep {
    readonly kind: "unique";
}
export interface filterStep{
    readonly kind: "filter" ;
    readonly criteria : properties ;
}
export interface takestep {
    readonly kind:"take" ;
    readonly count:number ;

}
export interface propertyStep{
    readonly kind: "property"
    readonly key : string ;

}

export type queryStep = vertexStep | outStep | inStep | uniqueStep | filterStep | takestep | propertyStep;
export class Query {
    private readonly steps: queryStep[] = [];
    constructor(
        private readonly graph: Graph,
        vertexIds: string[],
    ) {
        this.steps.push({
            kind: "vertex",
            ids: vertexIds.map((id) => id.trim()),
        });
    }
    out(label: string): this {
        this.steps.push({
            kind: "out",
            label: label.trim(),
        });
        return this;


    }
    in(label: string): this {
        this.steps.push({
            kind: "in",
            label: label.trim(),
        });
        return this;
    }


    unique(): this {
        this.steps.push({
            kind: "unique",
        });


        return this;
    }
    filter(criteria:properties):this{
        this.steps.push({
            kind: "filter" ,
            criteria: {...criteria} ,
        }) ;
        return this ;
    }
    take(count:number): this{
        if(!Number.isInteger(count) || count < 0 ){
            throw new Error("Take count must be a non-negative integer");
        }
        this.steps.push({
            kind: "take",
            count,
        });
        return this ;
    }
    property(key: string): this {
        const cleanKey = key.trim() ;

        if (!cleanKey){
            throw new Error("Property name cannot be empty");

        }
        this.steps.push({
            kind:"property",
            key:cleanKey,
        });
        return this;

    }
    private *outgoingVertices(
        items: Iterable<Vertex>,
        label: string,

    ): Generator<Vertex> {
        for (const vertex of items){
            const edges = this.graph.getOutgoingEdges(vertex.id);

            for(const edge of edges){
                if (edge.label !== label){
                    continue ;
                }
                const target = this.graph.getVertex(edge.target);

                if (target){
                    yield target ;
                }
            }
        }
    }
    *iterate(): Generator<Vertex> {
        const firstStep = this.steps[0] ;

        if (!firstStep || firstStep.kind !== "vertex"){
            return ;
        }
        const startingIds = firstStep.ids ;
        const graph = this.graph ;

        function* startingVertices(): Generator<Vertex>{
        for (const id of startingIds){
            const vertex = graph.getVertex(id); 
            if (vertex) {
                yield vertex ;
            }
        }
    }
    let results: Iterable<Vertex> = startingVertices() ;

    for (const step of this.steps.slice(1)){
        if(step.kind ==="out"){
            results = this.outgoingVertices(results,step.label);
            continue ;
        }
        if (step.kind === "take"){
            results = takeFrom(results, step.count);
        }
    }
    yield* results ;
}

    run(): unknown[] {
        const firstStep = this.steps[0];
        if (!firstStep || firstStep.kind !== "vertex") {
            return [];
        }

        let results: Vertex[] = [];
        for (const id of firstStep.ids) {
            const vertex = this.graph.getVertex(id);
            if (vertex) {
                results.push(vertex);
            }
        }
        for (const step of this.steps.slice(1)) {
            if(step.kind == "unique"){
                const seen = new Set<string>() ;
                results = results.filter((vertex) => {
                    if(seen.has(vertex.id)){
                        return false ;
                    }
                    seen.add(vertex.id);
                    return true ;

                });
                continue ;
            }
            if(step.kind === "filter"){
                const criteria = Object.entries(step.criteria);
                results = results.filter((vertex)=>{
                    return criteria.every(([key,expectedValue])=>{
                        return vertex.properties[key] === expectedValue ;
                    });
                });
                continue ;
            }
            if(step.kind === "take") {
                results = results.slice(0, step.count) ;
                continue ;
            }
            const nextResults: Vertex[] = [];
            if (step.kind === "out") {
                for (const vertex of results) {
                    const edges = this.graph.getOutgoingEdges(vertex.id);
                    for (const edge of edges) {
                        if (edge.label !== step.label) {
                            continue;

                        }
                        const target = this.graph.getVertex(edge.target);

                        if (target) {
                            nextResults.push(target);
                        }
                    }
                }
            }
            if (step.kind === "in") {
                for (const vertex of results) {
                    const edges = this.graph.getIncomingEdges(vertex.id);

                    for (const edge of edges) {
                        if (edge.label !== step.label) {
                            continue;
                        }
                        const source = this.graph.getVertex(edge.source);
                        if (source) {
                            nextResults.push(source);
                        }
                    }
                }
            }
            if(step.kind === "property"){
                const values: unknown[] = [] ;
                for (const vertex of results){
                    const value = vertex.properties[step.key];
                    if (value !== undefined){
                        values.push(value) ;
                    }
                }
                return values ;
            }
            results = nextResults;
        }

        return results;
    }
    getPlan(): queryStep[] {
        return this.steps.map((step) => {
            if (step.kind === "vertex") {
                return {
                    ...step,
                    ids: [...step.ids],
                };
            }
            if (step.kind === "filter"){
                return {
                    ...step,
                    criteria:{...step.criteria },
                };
            }
            return { ...step };
        });
    }
}
