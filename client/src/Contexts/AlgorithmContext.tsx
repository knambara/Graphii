import React, { useReducer, createContext } from "react";

type Action =
  | { type: "start" }
  | { type: "stop" }
  | { type: "set"; newName: string }
  | { type: "cancel" };
type Dispatch = (action: Action) => void;
type State = { name: string | null; running: boolean };
type AlgoProviderProps = { children: React.ReactNode };

const AlgoStateContext = createContext<State | undefined>(undefined);
const AlgoDispatchContext = createContext<Dispatch | undefined>(undefined);

function algoReducer(state: State, action: Action) {
  switch (action.type) {
    case "start": {
      return { ...state, running: true };
    }
    case "stop": {
      return { ...state, running: true };
    }
    case "set": {
      return { name: action.newName, running: false };
    }
    case "cancel": {
      return { name: null, running: false };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

function AlgoProvider({ children }: AlgoProviderProps) {
  const [state, dispatch] = useReducer(algoReducer, {
    name: null,
    running: false,
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
