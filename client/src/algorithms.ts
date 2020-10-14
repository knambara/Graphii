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

export function bellmanFord(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface,
  target: VertexInterface,
  heuristic: Map<VertexInterface, number>
) {
  const traversed: EdgeInterface[] = [];
  let path: EdgeInterface[] = [];

  for (const v of vertices) {
    v.dist = Infinity;
    v.prev = null;
  }
  source.dist = 0; // Distance from source to itself
  let relaxed = null;

  for (let i = 0; i < vertices.length - 1; i++) {
    if (relaxed !== null && !relaxed) break;
    else {
      relaxed = false;
      for (const edge of edges) {
        traversed.push(edge);
        const u = edge.headNode;
        const v = edge.tailNode;
        let uvDist = u!.dist + edge.weight;
        if (uvDist < v.dist) {
          relaxed = true;
          v.dist = uvDist;
          v.prev = u; // Maintain pointers for path
        }
      }
    }
  }
  const shortestPath = getPathToNode(target, edges);
  return [traversed, shortestPath];
}

/********** SPANNING TREE ALGORITHMS **********/

function prim(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface
) {
  for (const v of vertices) {
    v.dist = Infinity;
    v.prev = null;
  }
  source.dist = 0;

  //const traversed: EdgeInterface[] = [];
  const mst: EdgeInterface[] = [];

  const PQ = new PriorityQueue<VertexInterface, number>();
  for (const v of vertices) PQ.enqueue(v, v.dist);

  while (!PQ.isEmpty) {
    const u = PQ.dequeue()!;
    if (u.prev !== null) {
      const edge = edges.find(
        (edge) => edge.headNode === u.prev && edge.tailNode === u
      );
      mst.push(edge!);
    }

    const incidentEdges = edges.filter(
      (e) => e.headNode === u && PQ.containsKey(e.tailNode)
    );
    for (const edge of incidentEdges) {
      const v = edge.tailNode;
      let uvDist = u.dist + edge.weight;
      if (uvDist < v.dist) {
        v.dist = uvDist;
        v.prev = u; // Maintain pointers for path
        PQ.decreaseKey(v, v.dist);
      }
    }
  }
  return mst;
}

// Path compression and parent lookup
function findRoot(
  node: VertexInterface,
  parent: Map<VertexInterface, VertexInterface>
) {
  if (parent.get(node) !== node) {
    parent.set(node, findRoot(parent.get(node)!, parent));
  }
  return parent.get(node)!;
}

function merge(
  u: VertexInterface,
  v: VertexInterface,
  parent: Map<VertexInterface, VertexInterface>,
  rank: Map<VertexInterface, number>
) {
  const uParent = findRoot(u, parent)!;
  const vParent = findRoot(v, parent)!;
  const uRank = rank.get(uParent)!;
  const vRank = rank.get(vParent)!;

  // Point v cloud to u cloud
  if (uRank > vRank) {
    parent.set(vParent, uParent);
    rank.set(uParent, uRank + 1);
  } else {
    parent.set(uParent, vParent);
    rank.set(vParent, vRank + 1);
  }
}

function kruskal(
  vertices: Array<VertexInterface>,
  edges: Array<EdgeInterface>,
  source: VertexInterface
) {
  const sortedEdges = edges.sort((e1, e2) => (e1.weight < e2.weight ? -1 : 1));
  const parent = new Map<VertexInterface, VertexInterface>();
  const rank = new Map<VertexInterface, number>();

  vertices.forEach((vertex) => {
    parent.set(vertex, vertex);
    rank.set(vertex, 0);
  });

  const mst: EdgeInterface[] = [];
  for (const edge of sortedEdges) {
    const u = edge.headNode;
    const v = edge.tailNode;
    if (findRoot(u, parent) !== findRoot(v, parent)) {
      mst.push(edge);
      merge(u, v, parent, rank);
    }
  }
  return mst;
}

/********** MAX-FLOW ALGORITHMS **********/
