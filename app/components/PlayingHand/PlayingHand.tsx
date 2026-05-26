'use client';

import { Card as CardType } from '@/lib/types/card';
import { PlayingCard } from '../PlayingCard';
import type { CSSProperties } from 'react';
import styles from './PlayingHand.module.css';

interface HandProps {
  cards: CardType[];
  selectedCards: Set<string>;
  onCardClick: (cardId: string) => void;
  onCardDoubleClick: (cardId: string) => void;
}

type CardWrapperStyle = CSSProperties & {
  '--card-index': number;
  '--card-count': number;
  '--card-offset': number;
  '--fan-rotation': string;
  '--fan-drop': string;
};

export const PlayingHand = ({
  cards,
  selectedCards,
  onCardClick,
  onCardDoubleClick,
}: HandProps) => {
  const totalCards = cards.length;

  if (totalCards === 0) return null;

  return (
    <div className={styles.handContainer} data-walkthrough="hand">
      <div
        className={styles.cardsInner}
        style={{ '--card-count': totalCards } as CSSProperties & { '--card-count': number }}
      >
        {cards.map((card, index) => {
          const isSelected = selectedCards.has(card.id);
          const midpoint = (totalCards - 1) / 2;
          const offsetFromCenter = index - midpoint;
          const fanRotation = offsetFromCenter * 5.5;
          const fanDrop = Math.abs(offsetFromCenter) * 7;

          const wrapperStyle = {
            zIndex: isSelected ? 1000 : totalCards - index,
            '--card-index': index,
            '--card-count': totalCards,
            '--card-offset': offsetFromCenter,
            '--fan-rotation': `${fanRotation}deg`,
            '--fan-drop': `${fanDrop}px`,
          } as CardWrapperStyle;

          return (
            <div
              key={card.id}
              className={styles.cardWrapper}
              style={wrapperStyle}
            >
              <PlayingCard
                card={card}
                isSelected={isSelected}
                onClick={() => onCardClick(card.id)}
                onDoubleClick={() => onCardDoubleClick(card.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
