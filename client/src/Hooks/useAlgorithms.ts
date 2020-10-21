import { useState, useEffect } from "react";

import { useAlgoState } from "Contexts/AlgorithmContext";
import { Node, Edge } from "Components/App/Container/Canvas";
import { getConnectedComponents, dijkstra, dfs, bfs, aStar } from "algorithms";
import {
  prim,
  kruskal,
  fulkerson,
  PathOutput,
  MaxFlowOutput,
} from "algorithms";
import { EdgeInterface } from "Interfaces/EdgeInterface";
import { VertexInterface } from "Interfaces/VertexInterface";
import { getDistance } from "helper";

export const useAlgorithms = () => {
  const [source, setSource] = useState<Node | null>(null);
  const [target, setTarget] = useState<Node | null>(null);
  const algoState = useAlgoState();

  const setSourceNode = (node: Node | null) => {
    setSource(node);
  };

  const setTargetNode = (node: Node | null) => {
    setTarget(node);
  };

  const getHeuristic = (nodes: Node[], target: Node) => {
    const heuristic = new Map<VertexInterface, number>();
    for (const node of nodes) {
      const dist = getDistance(node.x, node.y, target.x, target.y);
      heuristic.set(node, dist);
    }
    return heuristic;
  };

  const runPathAlgorithm = (
    algorithm: string,
    nodes: Node[],
    edges: Edge[]
  ): PathOutput => {
    switch (algorithm) {
      case "dijkstra":
        return dijkstra(nodes, edges, source!, target!);
      case "dfs":
        return dfs(nodes, edges, source!, target!);
      case "bfs":
        return bfs(nodes, edges, source!, target!);
      case "a*":
        const heuristic = getHeuristic(nodes, target!);
        return aStar(nodes, edges, source!, target!, heuristic);
      default:
        throw new Error();
    }
  };

  const runTreeAlgorithm = (
    algorithm: string,
    nodes: Node[],
    edges: Edge[]
  ): PathOutput => {
    switch (algorithm) {
      case "prim":
        return prim(nodes, edges, source!);
      case "kruskal":
        return kruskal(nodes, edges, source!);
      default:
        throw new Error();
    }
  };

  const runFlowAlgorithm = (
    algorithm: string,
    nodes: Node[],
    edges: Edge[]
  ): MaxFlowOutput => {
    switch (algorithm) {
      case "fulkerson":
        return fulkerson(nodes, edges, source!, target!);
      default:
        throw new Error();
    }
  };

  function checkConnectedComponents(
    V: VertexInterface[],
    E: EdgeInterface[],
    v: VertexInterface,
    u: VertexInterface
  ) {
    const cc = getConnectedComponents(V, E);
    return cc.get(v) === cc.get(u) ? true : false;
  }

  useEffect(() => {
    if (algoState.name === null) {
      setSource(null);
      setTarget(null);
    }
  }, [algoState, setSource, setTarget]);

  return {
    setSourceNode,
    setTargetNode,
    source,
    target,
    runPathAlgorithm,
    runTreeAlgorithm,
    runFlowAlgorithm,
    checkConnectedComponents,
  };
};
