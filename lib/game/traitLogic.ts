import { State } from '../types/playerState';
import { Trait } from '../types/trait';

export function applyTrait(
  species: State,
  trait: Trait
): State {
  let next = {
    ...species,
    traits: [...species.traits, trait]
  };

  if (trait.apply) {
    next = trait.apply(next);
  }

  return next;
}

