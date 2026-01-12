'use client';

import { Button } from '@mui/material';
import { GameState } from '@/lib/game/gameState';
import { Ante } from '@/lib/game/challenges';
import { GameInfo } from '../components/GameInfo';
import { ChallengeModal } from '../components/ChallengeModal';
import { Deck } from '../components/Deck';
import { Hand } from '../components/Hand';
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

export const GameplayPage = ({
  gameState,
  currentAnte,
  onCardClick,
  onCardDoubleClick,
  onDiscard,
  onDrawCard,
  onEndRound,
  onSelectChallenge,
}: GameplayPageProps) => {
  const hasSelectedChallenge = gameState.selectedChallengeId !== null;
  const hasSelectedCards = gameState.selectedCards.size > 0;

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
            <Button
              variant="contained"
              size="large"
              onClick={onEndRound}
              sx={{ fontWeight: 600 }}
            >
              End Round
            </Button>
          </div>

          <Deck count={gameState.deck.length} onClick={onDrawCard} />

          {hasSelectedCards && (
            <div className={styles.discardButtonWrapper} data-walkthrough="discard-button">
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={onDiscard}
                sx={{ fontWeight: 700, fontSize: '1.125rem' }}
              >
                Discard
              </Button>
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
