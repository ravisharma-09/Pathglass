import { describe, expect, it } from 'vitest';
import { Graph } from '../src/graph';

describe('graph', () => {
    it("stores and finds a vertex", () => {
        const graph = new Graph();

        graph.addVertex("northflow", {
            name: "Northflow",
            type: "company",
            city: "New York",
        });
        expect(graph.getVertex("northflow")).toEqual({
            id: "northflow",
            properties: {
                name: "Northflow",
                type: "company",
                city: "New York",
            },
        });
        expect(graph.size).toBe(1);

    });

    it("rejects duplicate vertex ids", () => {
        const graph = new Graph();
        graph.addVertex("northflow");
        expect(() => graph.addVertex("northflow")).toThrowError("Vertex with id northflow already exists");
    });
    it("rejects an empty vertex id", () => {
        const graph = new Graph();
        expect(() => graph.addVertex(" ")).toThrowError("Vertex needs a valid id");

    });
    it("returns undefined for a non-existing vertex", () => {
        const graph = new Graph();
        expect(graph.getVertex("Missing")).toBeUndefined();
    });
})
