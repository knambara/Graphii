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

export const getMatrix = ({
  scale,
  translateX,
  translateY,
}: {
  scale: number;
  translateX: number;
  translateY: number;
}) => `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;

// Returns new scale value based on scale sensitivity for every wheel action
// ex: scale sensitivity = 10 -> zoom -> 1.0 -> 1.1
export const getScale = ({
  scale,
  minScale,
  maxScale,
  scaleSensitivity,
  deltaScale,
}: {
  scale: number;
  minScale: number;
  maxScale: number;
  scaleSensitivity: number;
  deltaScale: number;
}) => {
  console.log(scale);
  console.log(deltaScale / (scaleSensitivity / scale));
  let newScale = scale + deltaScale / (scaleSensitivity / scale);
  console.log(newScale);
  newScale = Math.max(minScale, Math.min(newScale, maxScale));
  console.log(newScale);
  return [scale, newScale];
};

const hasPositionChanged = (pos: number, prevPos: number) => pos !== prevPos;

const valueInRange = (minScale: number, maxScale: number, scale: number) =>
  scale <= maxScale && scale >= minScale;

export const getTranslate = (
  minScale: number,
  maxScale: number,
  scale: number
) => ({
  pos,
  prevPos,
  translate,
}: {
  pos: number;
  prevPos: number;
  translate: number;
}) =>
  valueInRange(minScale, maxScale, scale) && hasPositionChanged(pos, prevPos)
    ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
    : translate;
