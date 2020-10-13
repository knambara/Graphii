import PQNode from "Classes/PQNode";
import PriorityQueue from "Classes/PriorityQueue";
import { VertexInterface } from "Interfaces/VertexInterface";
import { EdgeInterface } from "Interfaces/EdgeInterface";
import { getDistance } from "helper";

/********** HELPER FUNCTIONS **********/

function getPathToNode(
  node: VertexInterface,
  edges: EdgeInterface[]
): EdgeInterface[] {
  const path: EdgeInterface[] = [];
  let prev: VertexInterface | null = node.prev;
  let curr: VertexInterface = node;
  while (prev !== null) {
    let edge = edges.find(
      (edge) => edge.headNode === prev && edge.tailNode === curr
    );
    path.unshift(edge!);
    curr = prev;
    console.log(curr);
    prev = curr.prev;
  }
  return path;
}

/********** PATH-FINDING ALGORITHMS **********/
// Output: EdgeInterface[][]; tuple

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
    if (u === target) {
      break;
    } else {
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
  }
  const shortestPath = getPathToNode(target, edges);
  return [traversed, shortestPath];
}

export function dfs(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface,
  target: VertexInterface
) {
  const stack: VertexInterface[] = [];
  const visited: VertexInterface[] = [];
  const traversed: EdgeInterface[] = [];
  let path: EdgeInterface[] = [];

  for (const v of vertices) {
    v.prev = null;
  }

  stack.push(source);
  while (stack.length) {
    let node: VertexInterface = stack.pop()!;
    visited.push(node);

    if (node.prev) {
      const inEdge = edges.find(
        (edge) => edge.headNode === node.prev && edge.tailNode === node
      )!;
      traversed.push(inEdge);
    }

    if (node === target) {
      path = getPathToNode(node, edges);
      break;
    }

    let outEdges = edges.filter((edge) => edge.headNode === node);
    for (const edge of outEdges) {
      if (!visited.includes(edge.tailNode)) {
        edge.tailNode.prev = node;
        stack.push(edge.tailNode);
      }
    }
  }
  return [traversed, path];
}

export function bfs(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface,
  target: VertexInterface
) {
  const queue: VertexInterface[] = [];
  const visited: VertexInterface[] = [];
  const traversed: EdgeInterface[] = [];
  let path: EdgeInterface[] = [];

  for (const v of vertices) {
    v.prev = null;
  }

  queue.push(source);
  while (queue.length) {
    let node: VertexInterface = queue.shift()!;
    visited.push(node);

    if (node.prev) {
      const inEdge = edges.find(
        (edge) => edge.headNode === node.prev && edge.tailNode === node
      )!;
      traversed.push(inEdge);
    }

    if (node === target) {
      path = getPathToNode(node, edges);
      break;
    }

    let outEdges = edges.filter((edge) => edge.headNode === node);
    for (const edge of outEdges) {
      if (!visited.includes(edge.tailNode)) {
        edge.tailNode.prev = node;
        queue.push(edge.tailNode);
      }
    }
  }
  return [traversed, path];
}

export function aStar(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface,
  target: VertexInterface,
  heuristic: Map<VertexInterface, number>
) {
  for (const v of vertices) {
    v.dist = Infinity;
    v.prev = null;
  }
  source.dist = 0; // Distance from source to itself

  const PQ = new PriorityQueue<VertexInterface, number>();
  for (const v of vertices) PQ.enqueue(v, heuristic.get(v)! + v.dist);

  const traversed: Array<EdgeInterface> = [];

  while (PQ.isEmpty() === false) {
    const u = PQ.dequeue();

    if (u == target) {
      break;
    } else {
      const outgoingEdges = edges.filter((e) => e.headNode === u);
      for (const edge of outgoingEdges) {
        traversed.push(edge);
        const v = edge.tailNode;
        let uvDist = u!.dist + edge.weight;
        if (uvDist < v.dist) {
          v.dist = uvDist;
          v.prev = u; // Maintain pointers for path
          PQ.decreaseKey(v, heuristic.get(v)! + v.dist);
        }
      }
    }
  }

  const shortestPath = getPathToNode(target, edges);
  return [traversed, shortestPath];
}
/********** SPANNING TREE ALGORITHMS **********/
