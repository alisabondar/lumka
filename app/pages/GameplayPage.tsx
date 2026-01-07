'use client';

import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import GameInfo from '../components/GameInfo';
import ChallengeModal from '../components/ChallengeModal';
import Deck from '../components/Deck';
import Hand from '../components/Hand';
import styles from './GameplayPage.module.css';

interface GameplayPageProps {
  gameState: GameState;
  currentAnte: Ante;
  onCardClick: (cardId: string) => void;
  onCardDoubleClick: (cardId: string) => void;
  onDiscard: () => void;
  onDrawCard: () => void;
  onEndRound: () => void;
  onSelectChallenge: (challengeId: string) => void;
}

export default function GameplayPage({
  gameState,
  currentAnte,
  onCardClick,
  onCardDoubleClick,
  onDiscard,
  onDrawCard,
  onEndRound,
  onSelectChallenge,
}: GameplayPageProps) {
  const hasSelectedChallenge = gameState.selectedChallengeId !== null;
  const hasSelectedCards = gameState.selectedCards.size > 0;

  return (
    <div className={styles.container}>
      <GameInfo gameState={gameState} currentAnte={currentAnte} />

      {!hasSelectedChallenge && (
        <ChallengeModal
          ante={currentAnte}
          onSelectChallenge={onSelectChallenge}
        />
      )}

      {hasSelectedChallenge && (
        <>
          <div className={styles.endRoundContainer}>
            <button
              className={styles.endRoundButton}
              onClick={onEndRound}
            >
              End Round
            </button>
          </div>

          <Deck count={gameState.deck.length} onClick={onDrawCard} />

          {hasSelectedCards && (
            <div className={styles.discardContainer}>
              <button
                className={styles.discardButton}
                onClick={onDiscard}
              >
                Discard
              </button>
            </div>
          )}

          <Hand
            cards={gameState.hand}
            selectedCards={gameState.selectedCards}
            onCardClick={onCardClick}
            onCardDoubleClick={onCardDoubleClick}
          />
        </>
      )}
    </div>
  );
}

