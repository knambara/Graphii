import { createContext } from "react";

type ScaleAttribute = {
  minScale: number;
  maxScale: number;
  scaleSensitvity: number;
};

const ScaleContext = createContext<ScaleAttribute | undefined>(undefined);

export default ScaleContext;
