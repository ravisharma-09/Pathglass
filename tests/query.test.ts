import { describe, expect, it } from "vitest";
import { Query } from "../src/query";

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
}
);
