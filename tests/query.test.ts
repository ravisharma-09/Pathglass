import { describe, expect, it } from "vitest";
import { Query } from "../src/query";
import { Graph } from "../src/graph";

describe("Query", () => {

    it("records the starting vertices", () => {
        const graph = new Graph();
        const query = new Query(graph, ["ravi", "northflow"]);
        expect(query.getPlan()).toEqual([
            {
                kind: "vertex",
                ids: ["ravi", "northflow"],

            },
        ]);
    });
    it("starts a query from the graph", () => {
        const graph = new Graph();
        const query = graph.v("ravi");
        expect(query).toBeInstanceOf(Query);
        expect(query.getPlan()).toEqual([
            {
                kind: "vertex",
                ids: ["ravi"],
            },
        ]);
    });
    it("records an outgoing traversal", () => {

        const graph = new Graph();
        const query = graph.v("ravi").out("founded");

        expect(query.getPlan()).toEqual([
            {
                kind: "vertex",
                ids: ["ravi"],

            },
            {
                kind: "out",
                label: "founded",

            }
        ]);
    });
    it("records an incoming traversal", () => {
        const graph = new Graph();
        const query = graph.v("northflow").in("founded");
        expect(query.getPlan()).toEqual([
            {
                kind: "vertex",
                ids: ["northflow"],
            },
            {
                kind: "in",
                label: "founded",
            },

        ]);
    });
    it("returns the starting vertices when it runs", () => {
        const graph = new Graph();
        const ravi = graph.addVertex("ravi", {
            name: "Ravi",
        });
        graph.addVertex("northflow");
        const results = graph.v("ravi", "missing").run();
        expect(results).toEqual([ravi]);
    });
    it("follows outgoing edges with the requested label", () => {
        const graph = new Graph();
        graph.addVertex("ravi");
        const northflow = graph.addVertex("northflow", {
            type: "company",
        });
        graph.addVertex("hackclub");

        graph.addEdge("ravi", "northflow", "founded");
        graph.addEdge("ravi", "hackclub", "joined");
        const results = graph
            .v("ravi")
            .out("founded")
            .run();

        expect(results).toEqual([northflow]);
    });
    it("follows incoming edges with requested label", () => {
        const graph = new Graph();
        const ravi = graph.addVertex("ravi", {
            type: "person",
        });
        graph.addVertex("alex");
        graph.addVertex("northflow");
        graph.addEdge("ravi", "northflow", "founded");
        graph.addEdge("alex", "northflow", "joined");

        const results = graph
            .v("northflow")
            .in("founded")
            .run();
        expect(results).toEqual([ravi]);
    });
    it("runs multiple traversal steps in sequence", () => {
        const graph = new Graph();
        graph.addVertex("ravi");
        graph.addVertex("northflow");
        const clinic = graph.addVertex("city-clinic", {
            type: "clinic",
        });
        graph.addEdge("ravi", "northflow", "founded");
        graph.addEdge("northflow", "city-clinic", "serves");

        const results = graph
            .v("ravi")
            .out("founded")
            .out("serves")
            .run();

        expect(results).toEqual([clinic]);
    });
    it("records a unique step",()=>{
        const graph = new Graph() ;
        const query= graph
            .v("ravi")
            .out("knows")
            .unique();
        expect(query.getPlan()).toEqual([
            {
                kind: "vertex" ,
                ids: ["ravi"],
            },
            {
                kind:"out",
                label:"knows",
            },
            {
                kind:"unique",
            },
        ]);
    });
    it("removes duplicate vertices from the results", () => {
        const graph = new Graph();

        graph.addVertex("ravi");
        graph.addVertex("garvit") ;
        const northflow = graph.addVertex("northflow") ;

        graph.addEdge("ravi","northflow","works-on") ;
        graph.addEdge("garvit","northflow", "works-on") ;
        const results = graph 
            .v("ravi", "garvit")
            .out("works-on")
            .unique()
            .run();

        expect(results).toEqual([northflow]);

    });
    it("records a property filter", () => {
        const graph = new Graph();
        const query = graph
            .v("ravi", "northflow")
            .filter({
                type: "company",
                city:"New York",
            });
        expect(query.getPlan()).toEqual([
            {
                kind:"vertex",
                ids:["ravi", "northflow"]
            },
            {
                kind:"filter",
                criteria:{
                    type:"company",
                    city:"New York",

                },
            },
        ]);
    });

});