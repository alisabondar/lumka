'use client';

import { Paper } from '@mui/material';
import styles from './Deck.module.css';

interface DeckProps {
  count: number;
  onClick: () => void;
  isWalkthrough?: boolean;
  disabled?: boolean;
}

export const Deck = ({ count, onClick, isWalkthrough = false, disabled = false }: DeckProps) => {
  const isDisabled = disabled || count === 0;
  const stackClass = `${styles.deckStack} ${!isDisabled ? styles.deckStackEnabled : styles.deckStackDisabled}`;
  const cardClass = `${styles.deckCard} ${isWalkthrough ? styles.deckCardWalkthrough : ''}`;

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };

  const getTitle = () => {
    if (disabled) return 'Hand is full (6 cards max)';
    if (count === 0) return 'Deck is empty';
    return `Click to draw a card (${count} remaining)`;
  };

  return (
    <div
      onClick={handleClick}
      title={getTitle()}
      data-walkthrough="deck"
      className={stackClass}
    >
      <Paper elevation={8} className={cardClass}>
        <div className={styles.deckPattern} />
        {count > 0 && (
          <div className={styles.deckCount}>
            {count}
          </div>
        )}
      </Paper>
    </div>
  );
};
