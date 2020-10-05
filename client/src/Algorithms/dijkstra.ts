import PQNode from "Classes/PQNode";
import PriorityQueue from "Classes/PriorityQueue";

interface Vertex {
  dist: number;
  prev: Vertex | null;
}

interface Edge {
  headNode: Vertex;
  tailNode: Vertex;
  weight: number;
}

export function dijkstra(
  vertices: Array<Vertex>,
  edges: Array<Edge>,
  source: Vertex,
  target: Vertex
) {
  for (const v of vertices) {
    v.dist = Infinity;
    v.prev = null;
  }
  source.dist = 0; // Distance from source to itself

  const PQ = new PriorityQueue<Vertex, number>();
  for (const v of vertices) PQ.enqueue(v, v.dist);

  const traversed: Array<Edge> = [];

  while (PQ.isEmpty() === false) {
    const u = PQ.dequeue();
    const outgoingEdges = edges.filter((e) => e.headNode === u);

    for (const edge of outgoingEdges) {
      traversed.push(edge);
      const v = edge.tailNode;
      let uvDist = u!.dist + edge.weight;
      if (uvDist < v.dist) {
        v.dist = uvDist;
        v.prev = u; // Maintain pointers for path
        PQ.decreaseKey(v, v.dist);
      }
    }
  }

  return traversed;
}
