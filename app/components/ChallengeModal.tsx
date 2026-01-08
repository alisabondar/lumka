'use client';

import { Ante } from '@/lib/game/challenges';
import styles from './ChallengeModal.module.css';

interface ChallengeModalProps {
  ante: Ante;
  onSelectChallenge: (challengeId: string) => void;
}

export const ChallengeModal = ({ ante, onSelectChallenge }: ChallengeModalProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {ante.color} {ante.name} - Round {ante.ante}
        </h2>
        <p className={styles.modalSubtitle}>
          Choose one challenge to complete this round:
        </p>
        <div className={styles.challengesList}>
          {ante.challenges.map((challenge) => (
            <button
              key={challenge.id}
              className={styles.challengeButton}
              onClick={() => onSelectChallenge(challenge.id)}
            >
              <div className={styles.challengeButtonHeader}>
                <span className={styles.challengeButtonId}>{challenge.id}</span>
                <span className={styles.challengeButtonName}>{challenge.name}</span>
              </div>
              <p className={styles.challengeButtonDesc}>{challenge.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

