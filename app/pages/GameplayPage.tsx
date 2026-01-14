'use client';

import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import { GameInfo } from '../components/GameInfo';
import { ChallengeModal } from '../components/ChallengeModal';
import { Deck } from '../components/Deck';
import { Hand } from '../components/Hand';
import { GradientButton } from '../components/GradientButton';
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
  isWalkthrough?: boolean;
}

export const GameplayPage = ({
  gameState,
  currentAnte,
  onCardClick,
  onCardDoubleClick,
  onDiscard,
  onDrawCard,
  onEndRound,
  onSelectChallenge,
  isWalkthrough = false,
}: GameplayPageProps) => {
  const hasSelectedChallenge = gameState.selectedChallengeId !== null;
  const hasSelectedCards = gameState.selectedCards.size > 0;
  const isHandFull = gameState.hand.length >= 6;

  return (
    <div className={styles.gameplayContainer}>
      <GameInfo gameState={gameState} currentAnte={currentAnte} />

      {!hasSelectedChallenge && (
        <ChallengeModal
          ante={currentAnte}
          onSelectChallenge={onSelectChallenge}
        />
      )}

      {hasSelectedChallenge && (
        <>
          <div className={styles.endRoundButtonWrapper} data-walkthrough="end-round-button">
            <GradientButton
              size="large"
              onClick={onEndRound}
            >
              End Round
            </GradientButton>
          </div>

          <Deck
            count={gameState.deck.length}
            onClick={onDrawCard}
            isWalkthrough={isWalkthrough}
            disabled={isHandFull}
          />

          {hasSelectedCards && (
            <div className={styles.discardButtonWrapper} data-walkthrough="discard-button">
              <GradientButton
                size="large"
                onClick={onDiscard}
              >
                Discard
              </GradientButton>
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
};
