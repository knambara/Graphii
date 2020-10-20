import { stringify } from "querystring";
import React, { useReducer, createContext } from "react";

type Action =
  | { type: "start" }
  | { type: "pause" }
  | { type: "continue" }
  | { type: "stepF" }
  | { type: "stepB" }
  | { type: "complete"; newValue: string }
  | { type: "cancel" }
  | { type: "set"; newName: string; category: string | null; newStatus: string }
  | { type: "setStatus"; newStatus: string; ready: boolean }
  | { type: "reset" }
  | { type: "error"; newStatus: string };
type Dispatch = (action: Action) => void;
type State = {
  name: string | null;
  category: string | null;
  status: string | null;
  ready: boolean;
  value: string;
};
type AlgoProviderProps = { children: React.ReactNode };

const AlgoStateContext = createContext<State | undefined>(undefined);
const AlgoDispatchContext = createContext<Dispatch | undefined>(undefined);

function algoReducer(state: State, action: Action) {
  switch (action.type) {
    case "start":
      return { ...state, status: "running", ready: true };
    case "pause":
      return { ...state, status: "paused" };
    case "continue":
      return { ...state, status: "running" };
    case "stepF":
      return { ...state, status: "stepF" };
    case "stepB":
      return { ...state, status: "stepB" };
    case "complete":
      return { ...state, status: "completed", value: action.newValue };
    case "cancel":
      return {
        name: null,
        category: null,
        status: null,
        ready: false,
        value: "",
      };
    case "set":
      return {
        name: action.newName,
        category: action.category,
        status: action.newStatus,
        ready: false,
        value: "",
      };
    case "setStatus":
      return { ...state, status: action.newStatus, ready: action.ready };
    case "reset":
      return { ...state, status: "setSource", ready: false, value: "" };
    case "error":
      return { ...state, status: action.newStatus, ready: false, value: "" };

    default:
      throw new Error(`Unhandled action type`);
  }
}

function AlgoProvider({ children }: AlgoProviderProps) {
  const [state, dispatch] = useReducer(algoReducer, {
    name: null,
    category: null,
    status: null,
    ready: false,
    value: "",
  });

  return (
    <AlgoStateContext.Provider value={state}>
      <AlgoDispatchContext.Provider value={dispatch}>
        {children}
      </AlgoDispatchContext.Provider>
    </AlgoStateContext.Provider>
  );
}

function useAlgoState() {
  const context = React.useContext(AlgoStateContext);
  if (context === undefined) {
    throw new Error("useAlgoState must be used within a AlgoProvider");
  }
  return context;
}

function useAlgoDispatch() {
  const context = React.useContext(AlgoDispatchContext);
  if (context === undefined) {
    throw new Error("useAlgoDispatch must be used within a AlgoProvider");
  }
  return context;
}

export { AlgoProvider, useAlgoState, useAlgoDispatch };
