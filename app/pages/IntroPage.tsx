'use client';

import styles from './IntroPage.module.css';

interface IntroPageProps {
  onStart: () => void;
}

export default function IntroPage({ onStart }: IntroPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.introScreen}>
        <h1 className={styles.introTitle}>🐱 LUMKA 🐱</h1>
        <div className={styles.introContent}>
          <p className={styles.introDescription}>
            Welcome to the evolution game! You are a cute kitten that must grow into a cat with useful cat traits.
          </p>
          <div className={styles.introRules}>
            <h2>How to Play:</h2>
            <ul>
              <li>You have 6 cards in your hand at all times</li>
              <li>Click cards to select them, then click &quot;Discard&quot; to remove them</li>
              <li>Double-click a card to apply it as a trait to your cat</li>
              <li>Click the deck to draw a new card (costs 0.5 stability)</li>
              <li>Discarding cards also costs 0.5 stability</li>
              <li>Complete all 6 rounds by meeting challenge requirements</li>
              <li>If you fail a round, you lose!</li>
            </ul>
          </div>
          <button
            className={styles.startButton}
            onClick={onStart}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

