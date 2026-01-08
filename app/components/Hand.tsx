'use client';

import { Card as CardType } from '@/lib/types/card';
import { Card } from './Card';
import styles from './Hand.module.css';

interface HandProps {
  cards: CardType[];
  selectedCards: Set<string>;
  onCardClick: (cardId: string) => void;
  onCardDoubleClick: (cardId: string) => void;
}

export const Hand = ({
  cards,
  selectedCards,
  onCardClick,
  onCardDoubleClick,
}: HandProps) => {
  return (
    <div className={styles.handContainer}>
      <div className={styles.bottomCards} data-walkthrough="hand">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isSelected={selectedCards.has(card.id)}
            onClick={() => onCardClick(card.id)}
            onDoubleClick={() => onCardDoubleClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

