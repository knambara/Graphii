import { useState, useEffect } from "react";

import { useAlgoState } from "Contexts/AlgorithmContext";
import { Node, Edge } from "Components/App/Canvas";
import { dijkstra } from "algorithms";
import { EdgeInterface } from "Interfaces/EdgeInterface";

type Output = (EdgeInterface[] | null)[];

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

  const runAlgorithm = (
    algorithm: string,
    nodes: Node[],
    edges: Edge[]
  ): Output => {
    switch (algorithm) {
      case "dijkstra":
        return dijkstra(nodes, edges, source!, target!);
      default:
        throw new Error();
    }
  };

  useEffect(() => {
    if (algoState.name === null) {
      setSource(null);
      setTarget(null);
    }
  }, [algoState, setSource, setTarget]);

  return { setSourceNode, setTargetNode, source, target, runAlgorithm };
};
