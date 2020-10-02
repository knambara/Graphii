import { useCallback, useReducer, useState } from "react";
import { pan, zoom } from "helper";

import { TransformState } from "Interfaces/TransformState";
import { PanProps } from "Interfaces/PanProps";
import { ZoomProps } from "Interfaces/ZoomProps";
import { ScaleProps } from "Interfaces/ScaleProps";

type Action =
  | { type: "PAN"; props: PanProps }
  | { type: "ZOOM"; props: ZoomProps; scale: ScaleProps };

const initialState: TransformState = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

// TODO: Fix
const MENUBAR_OFFSET = 97;

// TODO: How to reconfigure transformOrigin on zoomout
const isStateValid = (state: TransformState): boolean => {
  const worldSpaceWidth = window.innerWidth * state.scale;
  const worldSpaceHeight = (window.innerHeight - MENUBAR_OFFSET) * state.scale;
  if (
    state.offsetX > 0 ||
    state.offsetY > 0 ||
    Math.abs(state.offsetX) * state.scale >
      worldSpaceWidth - window.innerWidth ||
    Math.abs(state.offsetY) * state.scale >
      worldSpaceHeight - (window.innerHeight - MENUBAR_OFFSET)
  ) {
    return false;
  } else {
    return true;
  }
};

const transformReducer = (
  state: TransformState,
  action: Action
): TransformState => {
  switch (action.type) {
    case "PAN":
      const newStateFromPan = pan(state, action.props);
      return isStateValid(newStateFromPan) ? newStateFromPan : state;
    case "ZOOM":
      const newStateFromZoom = zoom(state, action.props, action.scale);
      return isStateValid(newStateFromZoom) ? newStateFromZoom : state;
    default:
      throw new Error();
  }
};

export const useTransformation = (scaleProps: ScaleProps) => {
  const [state, dispatch] = useReducer(transformReducer, initialState);

  const usePan = useCallback(
    (panProps: PanProps): void => dispatch({ type: "PAN", props: panProps }),
    [dispatch, scaleProps]
  );

  const useZoom = useCallback(
    (zoomProps: ZoomProps): void =>
      dispatch({ type: "ZOOM", props: zoomProps, scale: scaleProps }),
    [dispatch, scaleProps]
  );

  return { transformState: state, pan: usePan, zoom: useZoom };
};
