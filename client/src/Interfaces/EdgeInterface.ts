import { VertexInterface } from "./VertexInterface";

export interface EdgeInterface {
  headNode: VertexInterface;
  tailNode: VertexInterface;
  weight: number;
}
