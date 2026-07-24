export type  properties = Record<string, unknown>  ; 
export interface Vertex{
    readonly id:string;
    readonly properties:properties;

}
export class Graph{
    private readonly vertices = new Map<string,Vertex>();
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
        return vertex;


    }
    getVertex(id:string):Vertex | undefined{
        return this.vertices.get(id) ;
    }
    get size():number{
        return this.vertices.size ;
    }

} 