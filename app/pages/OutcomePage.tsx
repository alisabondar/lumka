'use client';

import styles from './OutcomePage.module.css';

interface OutcomePageProps {
  won: boolean;
  onPlayAgain: () => void;
}

export default function OutcomePage({ won, onPlayAgain }: OutcomePageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.endScreen}>
        <h1 className={styles.endTitle}>
          {won ? 'Congrats, you sly cat! 🐱' : 'Guess you&apos;re not good enough 😿'}
        </h1>
        <p className={styles.endMessage}>
          {won
            ? 'You\'ve successfully evolved through all 6 rounds!'
            : 'You failed to meet the challenge requirements.'}
        </p>
        <button
          className={styles.playAgainButton}
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

