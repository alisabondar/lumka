import { State } from "./playerState";

export type Ante = {
  id: string;
  ante: number;
  description: string;
  check: (state: State) => boolean;
};
