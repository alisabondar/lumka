'use client';

import { Card as CardType } from '@/lib/types/card';
import { PlayingCard } from '../PlayingCard';
import { useState, useEffect } from 'react';
import styles from './PlayingHand.module.css';

interface HandProps {
  cards: CardType[];
  selectedCards: Set<string>;
  onCardClick: (cardId: string) => void;
  onCardDoubleClick: (cardId: string) => void;
}

const calculateSpacing = (cardCount: number) => {
  const cardWidth = 120;
  const maxSpacing = 20;

  const totalCardsWidth = cardWidth * cardCount;
  const spacingBetweenCards = maxSpacing * (cardCount - 1);
  const totalWidth = totalCardsWidth + spacingBetweenCards;

  const viewportWidth = window.innerWidth;
  const targetWidth = viewportWidth * 0.8;

  if (totalWidth > targetWidth) {
    const overlapNeeded = totalWidth - targetWidth;
    const overlapPerCard = overlapNeeded / (cardCount - 1);
    return maxSpacing - overlapPerCard;
  }
  return maxSpacing;
};

export const PlayingHand = ({
  cards,
  selectedCards,
  onCardClick,
  onCardDoubleClick,
}: HandProps) => {
  const totalCards = cards.length;
  const [spacing, setSpacing] = useState(() => calculateSpacing(totalCards));

  useEffect(() => {
    const handleResize = () => {
      setSpacing(calculateSpacing(totalCards));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [totalCards]);

  if (totalCards === 0) return null;

  return (
    <div className={styles.handContainer} data-walkthrough="hand">
      <div className={styles.cardsInner}>
        {cards.map((card, index) => {
          const isSelected = selectedCards.has(card.id);
          const selectedLift = isSelected ? -8 : 0;

          const wrapperStyle = {
            marginLeft: index === 0 ? '0' : `${spacing}px`,
            marginTop: `${selectedLift}px`,
            zIndex: isSelected ? 1000 : totalCards - index,
          };

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
