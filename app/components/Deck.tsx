'use client';

import { Paper } from '@mui/material';
import styles from './Deck.module.css';

interface DeckProps {
  count: number;
  onClick: () => void;
}

export const Deck = ({ count, onClick }: DeckProps) => {
  const stackClass = `${styles.deckStack} ${count > 0 ? styles.deckStackEnabled : styles.deckStackDisabled}`;

  return (
    <div
      onClick={onClick}
      title={count > 0 ? `Click to draw a card (${count} remaining)` : 'Deck is empty'}
      data-walkthrough="deck"
      className={stackClass}
    >
      <Paper elevation={8} className={styles.deckCard}>
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
