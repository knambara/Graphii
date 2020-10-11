import React, { useReducer, createContext } from "react";

type State = { key: string | null; isPressed: boolean | null };
type Action = { type: "press"; key: string } | { type: "unpress"; key: string };
type Dispatch = (action: Action) => void;
type KeyProviderProps = { children: React.ReactNode };
const AcceptedKeys = ["Shift", "d", "w"];

const KeyStateContext = createContext<State | undefined>(undefined);
const KeyDispatchContext = createContext<Dispatch | undefined>(undefined);

function keyReducer(state: State, action: Action) {
  switch (action.type) {
    case "press":
      console.log(action.key);
      if (!AcceptedKeys.includes(action.key)) return { ...state };
      console.log(action.key);
      return { key: action.key, isPressed: true };
    case "unpress":
      if (state.key !== action.key) return { ...state };
      return { ...state, isPressed: false };
    default:
      throw new Error(`Unhandled action type`);
  }
}

function KeyProvider({ children }: KeyProviderProps) {
  const [state, dispatch] = useReducer(keyReducer, {
    key: null,
    isPressed: false,
  });

  return (
    <KeyStateContext.Provider value={state}>
      <KeyDispatchContext.Provider value={dispatch}>
        {children}
      </KeyDispatchContext.Provider>
    </KeyStateContext.Provider>
  );
}

function useKeyState() {
  const context = React.useContext(KeyStateContext);
  if (context === undefined) {
    throw new Error("useKeyState must be used within a KeyStateProvider");
  }
  return context;
}

function useKeyDispatch() {
  const context = React.useContext(KeyDispatchContext);
  if (context === undefined) {
    throw new Error("useKeyDispatch must be used within a KeyStateProvider");
  }
  return context;
}

export { KeyProvider, useKeyState, useKeyDispatch };
