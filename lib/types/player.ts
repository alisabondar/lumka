import { State } from "./playerState";

export type Player = {
  id: "player" | "opponent";
  state: State;
};
