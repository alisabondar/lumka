'use client';

import styles from './Deck.module.css';

interface DeckProps {
  count: number;
  onClick: () => void;
}

export const Deck = ({ count, onClick }: DeckProps) => {
  return (
    <div
      className={styles.deckStack}
      onClick={onClick}
      title={count > 0 ? `Click to draw a card (${count} remaining)` : 'Deck is empty'}
      data-walkthrough="deck"
    >
      <div className={styles.deckCard}>
        <div className={styles.deckPattern}></div>
      </div>
      {count > 0 && (
        <div className={styles.deckCount}>{count}</div>
      )}
    </div>
  );
};

