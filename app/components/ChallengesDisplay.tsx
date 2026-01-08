import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import styles from './ChallengesDisplay.module.css';

interface ChallengesDisplayProps {
  gameState: GameState;
  currentAnte: Ante;
  onEndRound: () => void;
}

export const ChallengesDisplay = ({
  gameState,
  currentAnte,
  onEndRound
}: ChallengesDisplayProps) => {
  return (
    <div className={styles.challengesDisplay}>
      <h3>Challenges (meet at least one):</h3>
      {currentAnte.challenges.map((challenge) => {
        const passed = challenge.check(gameState.playerState);
        return (
          <div
            key={challenge.id}
            className={`${styles.challenge} ${passed ? styles.challengePassed : ''}`}
          >
            <span className={styles.challengeId}>{challenge.id}:</span>
            <span className={styles.challengeName}>{challenge.name}</span>
            <span className={styles.challengeDesc}>{challenge.description}</span>
            {passed && <span className={styles.checkmark}>✓</span>}
          </div>
        );
      })}
      <button
        className={styles.endRoundButton}
        onClick={onEndRound}
      >
        End Round
      </button>
    </div>
  );
};

