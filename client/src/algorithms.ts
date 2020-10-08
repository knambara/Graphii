import PQNode from "Classes/PQNode";
import PriorityQueue from "Classes/PriorityQueue";
import { VertexInterface } from "Interfaces/VertexInterface";
import { EdgeInterface } from "Interfaces/EdgeInterface";

export function dijkstra(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface,
  target: VertexInterface
) {
  for (const v of vertices) {
    v.dist = Infinity;
    v.prev = null;
  }
  source.dist = 0; // Distance from source to itself

  const PQ = new PriorityQueue<VertexInterface, number>();
  for (const v of vertices) PQ.enqueue(v, v.dist);

  const traversed: Array<EdgeInterface> = [];

  while (PQ.isEmpty() === false) {
    const u = PQ.dequeue();
    const outgoingEdges = edges.filter((e) => e.headNode === u);

    for (const EdgeInterface of outgoingEdges) {
      traversed.push(EdgeInterface);
      const v = EdgeInterface.tailNode;
      let uvDist = u!.dist + EdgeInterface.weight;
      if (uvDist < v.dist) {
        v.dist = uvDist;
        v.prev = u; // Maintain pointers for path
        PQ.decreaseKey(v, v.dist);
      }
    }
  }

  const shortestPath = getShortestPathToNode(target, edges);
  return [traversed, shortestPath];
}

export function getShortestPathToNode(
  node: VertexInterface,
  edges: EdgeInterface[]
): EdgeInterface[] | null {
  if (node.prev === null) {
    return null;
  }

  const path: EdgeInterface[] = [];
  let prev: VertexInterface | null = node.prev;
  let curr: VertexInterface = node;
  while (prev !== null) {
    let edge = edges.find(
      (edge) => edge.headNode === prev && edge.tailNode === curr
    );
    path.unshift(edge!);
    curr = prev;
    prev = curr.prev;
  }
  return path;
}
