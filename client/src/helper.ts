import { TransformState } from "Interfaces/TransformState";
import { PanProps } from "Interfaces/PanProps";
import { ZoomProps } from "Interfaces/ZoomProps";
import { ScaleProps } from "Interfaces/ScaleProps";

export const getAngleRad = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const getDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

// input: offsetX, offsetY : integers; fWorldX, fWorldY: floats
// output: pair of screen coordinates; int[]
// NOTE: in our usage, offsets should only be negative
export const worldToScreen = ({
  offsetX,
  offsetY,
  fWorldX,
  fWorldY,
  scale,
}: {
  offsetX: number;
  offsetY: number;
  fWorldX: number;
  fWorldY: number;
  scale: number;
}): number[] => {
  let iScreenX = (fWorldX + offsetX) * scale;
  let iScreenY = (fWorldY + offsetY) * scale;
  return [iScreenX, iScreenY];
};

// input: all integers
// output: pair of world coordinates; float[]
export const screenToWorld = ({
  offsetX,
  offsetY,
  iScreenX,
  iScreenY,
  scale,
}: {
  offsetX: number;
  offsetY: number;
  iScreenX: number;
  iScreenY: number;
  scale: number;
}): number[] => {
  let fWorldX = iScreenX / scale - offsetX;
  let fWorldY = iScreenY / scale - offsetY;
  return [fWorldX, fWorldY];
};

// Return a new transformation state after pan event
export const pan = (
  currentState: TransformState,
  panProps: PanProps
): TransformState => {
  // subtraction translates mouse coordinate differences into world space offset;
  // basically a screen to world transform so we need to divide by scale
  return {
    ...currentState,
    offsetX: currentState.offsetX + panProps.movementX / currentState.scale,
    offsetY: currentState.offsetY + panProps.movementY / currentState.scale,
  };
};

export const zoom = (
  currentState: TransformState,
  zoomProps: ZoomProps,
  scaleProps: ScaleProps
): TransformState => {
  let currentScale = currentState.scale;
  let newScale = zoomProps.delta > 0 ? currentScale * 1.1 : currentScale * 0.9;

  // Restrict scale
  newScale = Math.min(
    scaleProps.maxScale,
    Math.max(scaleProps.minScale, newScale)
  );

  // Get world space coordinate of zoom event before scale change
  let [worldXBeforeZoom, worldYBeforeZoom] = screenToWorld({
    offsetX: currentState.offsetX,
    offsetY: currentState.offsetY,
    iScreenX: zoomProps.pageX,
    iScreenY: zoomProps.pageY,
    scale: currentScale,
  });

  // Get world space coordinate of zoom event after scale change
  let [worldXAfterZoom, worldYAfterZoom] = screenToWorld({
    offsetX: currentState.offsetX,
    offsetY: currentState.offsetY,
    iScreenX: zoomProps.pageX,
    iScreenY: zoomProps.pageY,
    scale: newScale,
  });

  // Adjust offset according to difference in world space
  let deltaOffsetX = worldXBeforeZoom - worldXAfterZoom;
  let deltaOffsetY = worldYBeforeZoom - worldYAfterZoom;

  return {
    ...currentState,
    offsetX: currentState.offsetX - deltaOffsetX,
    offsetY: currentState.offsetY - deltaOffsetY,
    scale: newScale,
  };
};
