import { describe, expect, it } from "vitest";
import { Query } from "../src/query";
import { Graph} from "../src/graph" ;

describe("Query", () => {
    it("records the starting vertices", () => {
        const query = new Query(["ravi", "northflow"]);
        expect(query.getPlan()).toEqual([
            {
                kind: "vertex",
                ids: ["ravi", "northflow"],

            },
        ]);
    });
    it("starts a query from the graph", () =>{
        const graph = new Graph() ;
        const query = graph.v("ravi");
        expect(query).toBeInstanceOf(Query);
        expect(query.getPlan()).toEqual([
            {
                kind:"vertex",
                ids:["ravi"],
            },
        ]);
    });
}
);
