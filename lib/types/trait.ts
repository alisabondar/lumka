import { State } from "./playerState";

export type TraitCategory = "positive" | "neutral" | "negative" | "wild";

export type Trait = {
  id: string;
  name: string;
  category: TraitCategory;
  description: string;
  apply?: (state: State) => State;
};
