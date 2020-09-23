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

const transformReducer = (
  state: TransformState,
  action: Action
): TransformState => {
  switch (action.type) {
    case "PAN":
      return pan(state, action.props);
    case "ZOOM":
      return zoom(state, action.props, action.scale);
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
