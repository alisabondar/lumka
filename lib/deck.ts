import { Card } from './types/card';
import type { CardEffect, FoxVariant } from './types/card';
import type { TraitCategory } from './types/trait';

type CardDefinition = {
  name: string;
  flavorText: string;
  effectText: string;
  foxVariant: FoxVariant;
  effect: CardEffect;
};

const FLOURISH_CARDS: CardDefinition[] = [
  {
    name: 'Heightened Instincts',
    flavorText: 'The tail twitches before trouble even arrives.',
    effectText: '+2 Score, +1 Stability.',
    foxVariant: 'alert',
    effect: { score: 2, stability: 1 },
  },
  {
    name: 'Keen Senses',
    flavorText: 'Tiny ears. Huge opinions.',
    effectText: '+2 Score. If you have no Burdens, gain +1 Stability.',
    foxVariant: 'wise',
    effect: { score: 2, ifNoCategory: { category: 'negative', stability: 1 } },
  },
  {
    name: 'Agile Movement',
    flavorText: 'A leap, a twist, and suddenly Lumka is elsewhere.',
    effectText: '+2 Score. If you have 3+ traits, gain +1 Score.',
    foxVariant: 'swift',
    effect: { score: 2, ifTraitCountAtLeast: { count: 3, score: 1 } },
  },
  {
    name: 'Efficient Forager',
    flavorText: 'Finds berries, beetles, and exactly one dramatic mushroom.',
    effectText: '+1 Score, +2 Stability.',
    foxVariant: 'moss',
    effect: { score: 1, stability: 2 },
  },
  {
    name: 'Tough Hide',
    flavorText: 'Soft fur over stubborn little armor.',
    effectText: '+1 Score, +1 Stability. Gain +1 Stability if you have a Burden.',
    foxVariant: 'scrappy',
    effect: { score: 1, stability: 1, ifCategoryCountAtLeast: { category: 'negative', count: 1, stability: 1 } },
  },
  {
    name: 'Social Bonds',
    flavorText: 'No legendary fox survives entirely on vibes.',
    effectText: '+1 Score. Gain +1 Score for each other Flourish.',
    foxVariant: 'blossom',
    effect: { score: 1, bonusScorePerCategory: { positive: 1 } },
  },
  {
    name: 'Clear Communication',
    flavorText: 'One bark says everything. Two barks is gossip.',
    effectText: '+2 Score. If you have an Adapt trait, gain +1 Stability.',
    foxVariant: 'alert',
    effect: { score: 2, ifCategoryCountAtLeast: { category: 'neutral', count: 1, stability: 1 } },
  },
  {
    name: 'High Fertility',
    flavorText: 'The den becomes a committee immediately.',
    effectText: '+1 Score. If you have 2+ traits, gain +1 Score.',
    foxVariant: 'sun',
    effect: { score: 1, ifTraitCountAtLeast: { count: 2, score: 1 } },
  },
  {
    name: 'Ancestral Memory',
    flavorText: 'Grandma fox left notes in the moonlight.',
    effectText: '+2 Score. If you have 4+ traits, gain +2 Score.',
    foxVariant: 'wise',
    effect: { score: 2, ifTraitCountAtLeast: { count: 4, score: 2 } },
  },
  {
    name: 'Established Territory',
    flavorText: 'This hill has been thoroughly sniffed and legally claimed.',
    effectText: '+2 Score, +1 Stability. If Stability is 8+, gain +1 Score.',
    foxVariant: 'moss',
    effect: { score: 2, stability: 1, ifStabilityAtLeast: { amount: 8, score: 1 } },
  },
  {
    name: 'Tool Use',
    flavorText: 'A stick is just a tiny wizard staff.',
    effectText: '+2 Score. Gain +1 Score if you have an Adapt trait.',
    foxVariant: 'scrappy',
    effect: { score: 2, ifCategoryCountAtLeast: { category: 'neutral', count: 1, score: 1 } },
  },
  {
    name: 'Mutual Support',
    flavorText: 'The pack brings snacks and emotional backup.',
    effectText: '+1 Score, +1 Stability. Gain +1 Stability per Flourish.',
    foxVariant: 'blossom',
    effect: { score: 1, stability: 1, bonusStabilityPerCategory: { positive: 1 } },
  },
  {
    name: 'Cunning Intelligence',
    flavorText: 'The plan has a plan.',
    effectText: '+3 Score. If Stability is 6+, gain +1 Score.',
    foxVariant: 'wise',
    effect: { score: 3, ifStabilityAtLeast: { amount: 6, score: 1 } },
  },
  {
    name: 'Rapid Adaptability',
    flavorText: 'Lumka changes tactics halfway through the pounce.',
    effectText: '+2 Score. Gain +1 Score per Adapt.',
    foxVariant: 'swift',
    effect: { score: 2, bonusScorePerCategory: { neutral: 1 } },
  },
  {
    name: 'Durable Physiology',
    flavorText: 'Built like a pillow with excellent survival instincts.',
    effectText: '+1 Score, +2 Stability. If Stability is 5 or less, gain +1 more Stability.',
    foxVariant: 'snow',
    effect: { score: 1, stability: 2, ifStabilityAtMost: { amount: 5, stability: 1 } },
  },
  {
    name: 'Dominant Presence',
    flavorText: 'Some foxes enter. This one arrives.',
    effectText: '+3 Score. If you have more Flourish than Burden, gain +1 Score.',
    foxVariant: 'sun',
    effect: { score: 3, ifCategoryCountAtLeast: { category: 'positive', count: 2, score: 1 } },
  },
  {
    name: 'Lasting Lineage',
    flavorText: 'The story keeps finding new paws.',
    effectText: '+2 Score, +1 Stability. If you have 5+ traits, gain +2 Score.',
    foxVariant: 'bonus',
    effect: { score: 2, stability: 1, ifTraitCountAtLeast: { count: 5, score: 2 } },
  },
];

const ADAPT_CARDS: CardDefinition[] = [
  {
    name: 'Vigilant Instincts',
    flavorText: 'Sleeps with one eye open and one paw judging.',
    effectText: '+1 Score.',
    foxVariant: 'alert',
    effect: { score: 1 },
  },
  {
    name: 'Inquisitive Senses',
    flavorText: 'What is that smell? Science must know.',
    effectText: '+1 Score. If you have a Flourish, gain +1 Score.',
    foxVariant: 'wise',
    effect: { score: 1, ifCategoryCountAtLeast: { category: 'positive', count: 1, score: 1 } },
  },
  {
    name: 'Variable Gait',
    flavorText: 'Walks like a question mark. Runs like an answer.',
    effectText: '+1 Score. If Stability is 6 or less, gain +1 Stability.',
    foxVariant: 'swift',
    effect: { score: 1, ifStabilityAtMost: { amount: 6, stability: 1 } },
  },
  {
    name: 'Opportunistic Foraging',
    flavorText: 'Dinner is wherever dinner forgot to hide.',
    effectText: '+1 Score, +1 Stability.',
    foxVariant: 'moss',
    effect: { score: 1, stability: 1 },
  },
  {
    name: 'Moderate Defense',
    flavorText: 'Not invincible. Annoyingly hard to convince otherwise.',
    effectText: '+1 Score. Gain +1 Stability if you have a Burden.',
    foxVariant: 'scrappy',
    effect: { score: 1, ifCategoryCountAtLeast: { category: 'negative', count: 1, stability: 1 } },
  },
  {
    name: 'Loose Social Structure',
    flavorText: 'A pack, technically. A group chat, emotionally.',
    effectText: '+1 Score. Gain +1 Score if you have 3+ traits.',
    foxVariant: 'blossom',
    effect: { score: 1, ifTraitCountAtLeast: { count: 3, score: 1 } },
  },
  {
    name: 'Flexible Communication',
    flavorText: 'Chirp, bark, glare, interpretive tail.',
    effectText: '+1 Score. Gain +1 Score per Catalyst.',
    foxVariant: 'alert',
    effect: { score: 1, bonusScorePerCategory: { wild: 1 } },
  },
  {
    name: 'Seasonal Fertility',
    flavorText: 'The calendar said maybe.',
    effectText: '+1 Score. If Stability is 7+, gain +1 Stability.',
    foxVariant: 'sun',
    effect: { score: 1, ifStabilityAtLeast: { amount: 7, stability: 1 } },
  },
  {
    name: 'Selective Memory',
    flavorText: 'Remembers food locations. Forgets consequences.',
    effectText: '+2 Score. Lose 1 Stability.',
    foxVariant: 'sleepy',
    effect: { score: 2, stability: -1 },
  },
  {
    name: 'Flexible Territory',
    flavorText: 'Home is where the exits are.',
    effectText: '+1 Score. Gain +1 Stability per Adapt.',
    foxVariant: 'snow',
    effect: { score: 1, bonusStabilityPerCategory: { neutral: 1 } },
  },
  {
    name: 'Tool Borrowing',
    flavorText: 'Borrowed. Absolutely planned to return it.',
    effectText: '+2 Score. If you have Tool Use, gain +1 Score.',
    foxVariant: 'scrappy',
    effect: { score: 2, ifCategoryCountAtLeast: { category: 'positive', count: 1, score: 1 } },
  },
  {
    name: 'Conditional Symbiosis',
    flavorText: 'Helpful, provided everyone reads the fine print.',
    effectText: '+1 Score, +1 Stability. If you have a Burden, gain +1 Score.',
    foxVariant: 'moss',
    effect: { score: 1, stability: 1, ifCategoryCountAtLeast: { category: 'negative', count: 1, score: 1 } },
  },
  {
    name: 'Adaptive Intelligence',
    flavorText: 'Learns quickly, especially from almost-disasters.',
    effectText: '+2 Score. If Stability is 5 or less, gain +1 Score.',
    foxVariant: 'wise',
    effect: { score: 2, ifStabilityAtMost: { amount: 5, score: 1 } },
  },
  {
    name: 'Trait Plasticity',
    flavorText: 'Shape is only a suggestion.',
    effectText: '+1 Score. Gain +1 Score for each category you have.',
    foxVariant: 'wild',
    effect: { score: 1, bonusScorePerCategory: { positive: 1, neutral: 1, negative: 1, wild: 1 } },
  },
  {
    name: 'Recovering Physiology',
    flavorText: 'A dramatic collapse, followed by an even more dramatic recovery.',
    effectText: '+1 Score. If Stability is 4 or less, gain +3 Stability.',
    foxVariant: 'snow',
    effect: { score: 1, ifStabilityAtMost: { amount: 4, stability: 3 } },
  },
  {
    name: 'Contested Dominance',
    flavorText: 'Confidence, interrupted.',
    effectText: '+2 Score. If you have a Burden, lose 1 Stability.',
    foxVariant: 'shadow',
    effect: { score: 2, ifCategoryCountAtLeast: { category: 'negative', count: 1, stability: -1 } },
  },
  {
    name: 'Uncertain Lineage',
    flavorText: 'The family tree has several question marks and one bite mark.',
    effectText: '+1 Score. If you have 4+ traits, gain +2 Score.',
    foxVariant: 'wild',
    effect: { score: 1, ifTraitCountAtLeast: { count: 4, score: 2 } },
  },
];

const BURDEN_CARDS: CardDefinition[] = [
  {
    name: 'Erratic Instincts',
    flavorText: 'The plan changes because the leaf moved.',
    effectText: '+1 Score. Lose 2 Stability.',
    foxVariant: 'scrappy',
    effect: { score: 1, stability: -2 },
  },
  {
    name: 'Impaired Senses',
    flavorText: 'Sniffs heroically in the wrong direction.',
    effectText: '+2 Score. Lose 2 Stability.',
    foxVariant: 'sleepy',
    effect: { score: 2, stability: -2 },
  },
  {
    name: 'Uncoordinated Movement',
    flavorText: 'Falls with commitment.',
    effectText: '+2 Score. Lose 1 Stability. If Stability is 4 or less, gain +1 Score.',
    foxVariant: 'scrappy',
    effect: { score: 2, stability: -1, ifStabilityAtMost: { amount: 4, score: 1 } },
  },
  {
    name: 'Chronic Hunger',
    flavorText: 'The mountain is beautiful. Also edible?',
    effectText: '+3 Score. Lose 2 Stability.',
    foxVariant: 'shadow',
    effect: { score: 3, stability: -2 },
  },
  {
    name: 'Brittle Armor',
    flavorText: 'Looks tough. Makes ceramic noises.',
    effectText: '+2 Score. Lose 2 Stability. Gain +1 Stability if you have a Flourish.',
    foxVariant: 'snow',
    effect: { score: 2, stability: -2, ifCategoryCountAtLeast: { category: 'positive', count: 1, stability: 1 } },
  },
  {
    name: 'Fractured Social Bonds',
    flavorText: 'The group chat is on fire.',
    effectText: '+3 Score. Lose 1 Stability per Burden.',
    foxVariant: 'shadow',
    effect: { score: 3, bonusStabilityPerCategory: { negative: -1 } },
  },
  {
    name: 'Disruptive Signals',
    flavorText: 'Every warning sounds like a party invitation.',
    effectText: '+2 Score. Lose 1 Stability. Gain +1 Score if you have an Adapt.',
    foxVariant: 'alert',
    effect: { score: 2, stability: -1, ifCategoryCountAtLeast: { category: 'neutral', count: 1, score: 1 } },
  },
  {
    name: 'Unstable Reproduction',
    flavorText: 'The den expands faster than the budget.',
    effectText: '+3 Score. Lose 2 Stability. If you have 5+ traits, gain +1 Score.',
    foxVariant: 'wild',
    effect: { score: 3, stability: -2, ifTraitCountAtLeast: { count: 5, score: 1 } },
  },
  {
    name: 'Memory Loss',
    flavorText: 'Lumka hid snacks from itself. Successfully.',
    effectText: '+2 Score. Lose 1 Stability.',
    foxVariant: 'sleepy',
    effect: { score: 2, stability: -1 },
  },
  {
    name: 'Overextended Territory',
    flavorText: 'Owns too much hill. Regrets the paperwork.',
    effectText: '+3 Score. Lose 2 Stability. If Stability is 7+, gain +1 Score.',
    foxVariant: 'sun',
    effect: { score: 3, stability: -2, ifStabilityAtLeast: { amount: 7, score: 1 } },
  },
  {
    name: 'Crude Tool Use',
    flavorText: 'The stick is upside down, but morale is high.',
    effectText: '+2 Score. Lose 1 Stability. Gain +1 Score per Adapt.',
    foxVariant: 'scrappy',
    effect: { score: 2, stability: -1, bonusScorePerCategory: { neutral: 1 } },
  },
  {
    name: 'Parasitic Dependence',
    flavorText: 'A partnership with suspicious billing.',
    effectText: '+3 Score. Lose 3 Stability. Gain +1 Stability per Flourish.',
    foxVariant: 'shadow',
    effect: { score: 3, stability: -3, bonusStabilityPerCategory: { positive: 1 } },
  },
  {
    name: 'Cognitive Overload',
    flavorText: 'Too many thoughts, not enough den.',
    effectText: '+4 Score. Lose 2 Stability.',
    foxVariant: 'wise',
    effect: { score: 4, stability: -2 },
  },
  {
    name: 'Maladaptive Evolution',
    flavorText: 'A bold solution to the wrong problem.',
    effectText: '+3 Score. Lose 2 Stability. If you have a Catalyst, gain +2 Score.',
    foxVariant: 'wild',
    effect: { score: 3, stability: -2, ifCategoryCountAtLeast: { category: 'wild', count: 1, score: 2 } },
  },
  {
    name: 'Fragile Physiology',
    flavorText: 'Extremely breakable. Also extremely dramatic.',
    effectText: '+2 Score. Lose 2 Stability. If Stability is 3 or less, gain +2 Score.',
    foxVariant: 'sleepy',
    effect: { score: 2, stability: -2, ifStabilityAtMost: { amount: 3, score: 2 } },
  },
  {
    name: 'Unchecked Aggression',
    flavorText: 'Lumka has chosen volume.',
    effectText: '+4 Score. Lose 3 Stability.',
    foxVariant: 'shadow',
    effect: { score: 4, stability: -3 },
  },
  {
    name: 'Broken Lineage',
    flavorText: 'A cracked branch can still bloom weirdly.',
    effectText: '+3 Score. Lose 2 Stability. If you have 4+ traits, gain +1 Stability.',
    foxVariant: 'bonus',
    effect: { score: 3, stability: -2, ifTraitCountAtLeast: { count: 4, stability: 1 } },
  },
];

const CATALYST_CARDS: CardDefinition[] = [
  {
    name: 'Evolutionary Catalyst',
    flavorText: 'Lumka remembers a future version of itself.',
    effectText: '+2 Score. Gain +1 Score and +1 Stability for each category you have.',
    foxVariant: 'star',
    effect: {
      score: 2,
      bonusScorePerCategory: { positive: 1, neutral: 1, negative: 1, wild: 1 },
      bonusStabilityPerCategory: { positive: 1, neutral: 1, negative: 1, wild: 1 },
    },
  },
];

function createCards(category: TraitCategory, cards: CardDefinition[]): Card[] {
  const prefix = category === 'positive'
    ? 'positive'
    : category === 'neutral'
      ? 'neutral'
      : category === 'negative'
        ? 'negative'
        : 'wild';

  return cards.map((card, index) => ({
    id: `${prefix}-${index}`,
    traitCategory: category,
    ...card,
  }));
}

export function createDeck(): Card[] {
  return [
    ...createCards('positive', FLOURISH_CARDS),
    ...createCards('neutral', ADAPT_CARDS),
    ...createCards('negative', BURDEN_CARDS),
    ...createCards('wild', CATALYST_CARDS),
  ];
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardDisplayName(card: Card): string {
  return card.name;
}
