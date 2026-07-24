export interface queryStep{
    readonly kind: "vertex" ;
    readonly ids : readonly string[] ;

}
export class Query {
    private readonly steps: queryStep[] = [] ;
    constructor(vertexIds: string[]){
        this.steps.push({
            kind: "vertex",
            ids: vertexIds.map((id)=> id.trim()),
        }) ;
    }
    getPlan():queryStep[]{
        return this.steps.map((step)=>({
            ...step,
            ids:[...step.ids],
        })) ;
    }
}
