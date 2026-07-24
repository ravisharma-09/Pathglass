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
    constructor(vertexIds: string[]){
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
