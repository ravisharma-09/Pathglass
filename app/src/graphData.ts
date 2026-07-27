export type GraphNode = {
    id: string ;
    name: string ;
    type: string ;
    x: number ;
    y: number;
}
export type GraphEdge = {
    from: string ;
    to: string ;
    label: string ;

}

export const demoNodes: GraphNode[] = [
    {
        id:"ravi",
        name:"Ravi",
        type:"person",
        x: 170,
        y: 265,
    },
    {
        id: "northflow",
        name: "NorthFlow",
        type: "company",
        x: 390,
        y: 155,
    },
    {
       id: "city-clinic" ,
       name: "City Clinic",
       type: "client",
       x: 620,
       y: 265,
    },
    {
        id: "garvit",
        name: "Garvit",
        type: "person",
        x:110,
        y:400
    },
    {
        id: "meera",
        name: "Meera",
        type: "person",
        x: 330,
        y: 400,

    },
];
export const demoEdges: GraphEdge[] =[
    {
        from:"ravi",
        to:"northflow",
        label:"founded",
    },
    {
        from: "northflow",
        to:"city-clinic",
        label: "serves",
    },
    {
        from:"ravi",
        to: "garvit",
        label: "knows",
    },
    {
        from:"ravi",
        to: "meera",
        label: "knows",
    },
    
];