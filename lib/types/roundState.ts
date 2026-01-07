import { Player } from "./player";
import { Trait } from "./trait";

export type RoundState = {
  round: number;
  ante: number;

  deck: Trait[];
  discard: Trait[];

  wildUsedThisRound: boolean;

  player: Player;
  opponent: Player;

  status: "playing" | "round-end" | "game-over";
};
