'use client';

import { useState } from 'react';
import { createDeck, shuffleDeck, getCardDisplayName } from '@/lib/deck';
import { Card, SUIT_SYMBOLS } from '@/lib/types/card';
import styles from './page.module.css';

export default function Home() {
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [isShuffled, setIsShuffled] = useState(false);

  const handleShuffle = () => {
    setDeck(shuffleDeck(deck));
    setIsShuffled(true);
  };

  const handleReset = () => {
    setDeck(createDeck());
    setIsShuffled(false);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Classic Card Deck
          </h1>
          <div className={styles.buttonContainer}>
            <button
              onClick={handleShuffle}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              Shuffle Deck
            </button>
            <button
              onClick={handleReset}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Reset Deck
            </button>
          </div>
          {isShuffled && (
            <p className={styles.shuffledMessage}>
              Deck shuffled!
            </p>
          )}
        </div>

        <div className={styles.cardsGrid}>
          {deck.map((card) => (
            <div
              key={card.id}
              className={`${styles.card} ${
                card.color === 'red'
                  ? styles.cardRed
                  : styles.cardBlack
              }`}
              title={getCardDisplayName(card)}
            >
              <div className={styles.cardSymbol}>
                {SUIT_SYMBOLS[card.suit]}
              </div>
              <div className={styles.cardRank}>{card.rank}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
