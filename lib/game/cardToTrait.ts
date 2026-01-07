import { Card } from '../types/card';
import { Trait } from '../types/trait';
import { State } from '../types/playerState';

// Convert a card to a trait
export function cardToTrait(card: Card): Trait {
  const traitNames: Record<string, string> = {
    positive: [
      'Sharp Claws', 'Keen Eyesight', 'Agile Paws', 'Silent Stalker', 'Quick Reflexes',
      'Strong Jaws', 'Flexible Spine', 'Night Vision', 'Balance Master', 'Hunting Instinct',
      'Territorial Marking', 'Grooming Expert', 'Playful Nature', 'Curious Explorer', 'Independent Spirit',
      'Affectionate Purr', 'Alert Guardian'
    ],
    neutral: [
      'Whisker Sensitivity', 'Tail Communication', 'Fur Insulation', 'Paw Pads', 'Retractable Claws',
      'Vertical Pupils', 'Ear Rotation', 'Vocal Range', 'Sleep Patterns', 'Territory Awareness',
      'Social Hierarchy', 'Grooming Ritual', 'Hunting Posture', 'Defensive Stance', 'Exploration Drive',
      'Comfort Seeking', 'Routine Preference'
    ],
    negative: [
      'Fragile Bones', 'Weak Immune System', 'Poor Balance', 'Slow Reflexes', 'Limited Vision',
      'Clumsy Paws', 'Anxious Behavior', 'Aggressive Tendency', 'Territorial Aggression', 'Stress Sensitivity',
      'Dependency Issues', 'Overgrooming', 'Destructive Scratching', 'Nocturnal Disruption', 'Hunting Failure',
      'Social Isolation', 'Health Vulnerability'
    ],
    wild: ['Adaptive Evolution']
  };

  const descriptions: Record<string, string> = {
    positive: 'A beneficial trait that enhances your cat\'s abilities',
    neutral: 'A balanced trait with no significant advantage or disadvantage',
    negative: 'A challenging trait that tests your cat\'s resilience',
    wild: 'A wild trait that can duplicate any other trait'
  };

  // Get a name from the appropriate category based on card ID for consistency
  const names = traitNames[card.traitCategory] || ['Unknown Trait'];
  // Use card ID hash to deterministically assign a name
  const hash = card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const name = names[hash % names.length];

  return {
    id: card.id,
    name,
    category: card.traitCategory,
    description: descriptions[card.traitCategory] || '',
    apply: (state: State): State => {
      // Default trait application logic
      // Positive traits increase score, negative decrease stability
      const newState = { ...state };

      if (card.traitCategory === 'positive') {
        newState.score += 2;
        newState.stability += 1;
      } else if (card.traitCategory === 'neutral') {
        newState.score += 1;
      } else if (card.traitCategory === 'negative') {
        newState.score += 1;
        newState.stability -= 2;
      } else if (card.traitCategory === 'wild') {
        // Wild traits don't apply directly, they duplicate other traits
        newState.score += 1;
      }

      return newState;
    },
  };
}

