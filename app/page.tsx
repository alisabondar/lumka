'use client';

import { useState } from 'react';
import { createDeck, shuffleDeck, getCardDisplayName } from '@/lib/deck';
import { Card, SUIT_SYMBOLS, TRAIT_SYMBOLS } from '@/lib/types/card';
import styles from './page.module.css';

export default function Home() {
  const [deck, setDeck] = useState<Card[]>(shuffleDeck(createDeck()));
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);

  const handleDrawCard = () => {
    if (deck.length > 0) {
      const newDeck = [...deck];
      const drawnCard = newDeck.pop()!;
      setDeck(newDeck);
      setDrawnCards([...drawnCards, drawnCard]);
    }
  };

  // Get the last 6 drawn cards to display at the bottom
  const visibleCards = drawnCards.slice(-6);

  return (
    <div className={styles.container}>
      <div
        className={styles.deckStack}
        onClick={handleDrawCard}
        title={deck.length > 0 ? `Click to draw a card (${deck.length} remaining)` : 'Deck is empty'}
      >
        <div className={styles.deckCard}>
          <div className={styles.deckPattern}></div>
        </div>
        {deck.length > 0 && (
          <div className={styles.deckCount}>{deck.length}</div>
        )}
      </div>

      <div className={styles.bottomCards}>
        {visibleCards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${
              card.color === 'red'
                ? styles.cardRed
                : styles.cardBlack
            }`}
            title={getCardDisplayName(card)}
          >
            <div className={styles.traitSymbol}>
              {TRAIT_SYMBOLS[card.traitCategory]}
            </div>
            <div className={styles.cardSymbol}>
              {SUIT_SYMBOLS[card.suit]}
            </div>
            <div className={styles.cardRank}>{card.rank}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
