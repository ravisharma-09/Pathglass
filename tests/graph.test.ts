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
    it("stores a directed edge", () => {
        const graph = new Graph();
        graph.addVertex("ravi", {
            name: "Ravi",
            type: "person",

        });
        graph.addVertex("northflow", {
            name: "Northflow",
            type: "company",

        });
        const relationship = graph.addEdge(
            "ravi",
            "northflow",
            "founded",
            { year: 2026 },
        );
        expect(relationship).toEqual({
            source: "ravi",
            target: "northflow",
            label: "founded",
            properties: {
                year: 2026
            },

        });
        expect(graph.getOutgoingEdges("ravi")).toEqual([relationship]);
        expect(graph.getIncomingEdges("northflow")).toEqual([relationship]);
        expect(graph.edgeCount).toBe(1);

    });
    it("keeps the direction of edges", () => {
        const graph = new Graph();
        graph.addVertex("ravi");
        graph.addVertex("northflow");
        graph.addEdge("ravi", "northflow", "founded");
        expect(graph.getOutgoingEdges("northflow")).toEqual([]);
        expect(graph.getIncomingEdges("ravi")).toEqual([]);

    });
    it("rejects an edge when its source does not exist", () => {
        const graph = new Graph();
        graph.addVertex("northflow");
        expect(() => {
            graph.addEdge("ravi", "northflow", "founded");
        }).toThrowError("Source vertex with id ravi does not exist");
    });
    it("rejects an edge when its target does not exist", () => {
        const graph = new Graph();
        graph.addVertex("ravi");
        expect(() => {
            graph.addEdge("ravi", "northflow", "founded");
        }).toThrowError("Target vertex with id northflow does not exist");
    });
    it("rejects an edge without a label", () => {
        const graph = new Graph();
        graph.addVertex("ravi");
        graph.addVertex("northflow");
        expect(() => {
            graph.addEdge("ravi", "northflow", " ");
        }).toThrowError("Edge needs a valid label");

    }); 
   

})

