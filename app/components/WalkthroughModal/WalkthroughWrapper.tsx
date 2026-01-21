"use client";

import { useState, useEffect, useRef } from "react";
import { createDeck, shuffleDeck } from '@/lib/deck';
import { createInitialGameState } from '@/lib/game/gameState';
import { getAnteForRound } from '@/lib/game/challenges';
import type { GameState } from '@/lib/game/gameState';
import { GameplayPage } from '../../pages/GameplayPage';
import { WalkthroughModal } from './WalkthroughModal';
import styles from './WalkthroughWrapper.module.css';

interface OverlayProps {
  elementRect: DOMRect;
}

const Overlay = ({ elementRect }: OverlayProps) => {
  const overlays = [
    { top: 0, left: 0, right: 0, height: `${elementRect.top}px` },
    { top: `${elementRect.top}px`, left: 0, width: `${elementRect.left}px`, height: `${elementRect.height}px` },
    { top: `${elementRect.top}px`, left: `${elementRect.left + elementRect.width}px`, right: 0, height: `${elementRect.height}px` },
    { top: `${elementRect.top + elementRect.height}px`, left: 0, right: 0, bottom: 0 },
  ];

  return (
    <>
      {overlays.map((style, index) => (
        <div
          key={index}
          style={{
            position: 'fixed',
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1001,
            pointerEvents: 'none',
            ...style,
          }}
        />
      ))}
    </>
  );
};

interface WalkthroughWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Welcome",
    text: "This is a quick walkthrough to help you learn how to play.",
    highlightElement: null,
  },
  {
    title: "Game Info",
    text: "At the top, you can see your current round, selected challenge, score, stability, and trait count.",
    highlightElement: "game-info",
  },
  {
    title: "Your Hand",
    text: "You always have 6 cards in your hand at the bottom of the screen.",
    highlightElement: "hand",
  },
  {
    title: "Selecting Cards",
    text: "Click cards to select them (they'll be highlighted). You can select multiple cards at once.",
    highlightElement: "hand",
  },
  {
    title: "Applying Traits",
    text: "Double-click a card to apply it as a trait to your cat. This will add it to your traits and update your stats.",
    highlightElement: "hand",
  },
  {
    title: "Drawing Cards",
    text: "Click the deck to draw a new card. Drawing costs 0.5 stability, so use it wisely!",
    highlightElement: "deck",
  },
  {
    title: "Discarding",
    text: "When you have cards selected, a Discard button appears. Discarding costs 0.5 stability and removes selected cards.",
    highlightElement: "discard-button",
  },
  {
    title: "Completing Rounds",
    text: "Click 'End Round' when you've met at least one challenge requirement. Complete all 6 rounds to win!",
    highlightElement: "end-round-button",
  }
];

export const WalkthroughWrapper = ({ isOpen, onClose }: WalkthroughWrapperProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mockGameState] = useState<GameState>(() => {
    const deck = shuffleDeck(createDeck());
    const state = createInitialGameState(deck);
    const ante = getAnteForRound(1);
    if (ante) {
      return { ...state, selectedChallengeId: ante.challenges[0].id, selectedCards: new Set() };
    }
    return state;
  });

  const displayGameState: GameState = {
    ...mockGameState,
    selectedCards: stepIndex >= 3 ? new Set([mockGameState.hand[0]?.id].filter(Boolean)) : new Set(),
  };

  useEffect(() => {
    if (!isOpen) return;

    const currentStep = STEPS[stepIndex];

    const updatePositions = () => {
      if (!currentStep.highlightElement) {
        setHighlightPosition(null);
        return;
      }

      const element = document.querySelector(`[data-walkthrough="${currentStep.highlightElement}"]`);
      if (!element || !containerRef.current) {
        setHighlightPosition(null);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (elementRect.width === 0 && elementRect.height === 0) {
        return;
      }

      const highlightPos = {
        top: elementRect.top - containerRect.top,
        left: elementRect.left - containerRect.left,
        width: elementRect.width,
        height: elementRect.height,
      };

      setHighlightPosition(highlightPos);
    };

    const frameId = requestAnimationFrame(() => {
      const timeoutId = setTimeout(() => {
        updatePositions();

        const retryTimeoutId = setTimeout(() => {
          updatePositions();
        }, 300);

        return () => clearTimeout(retryTimeoutId);
      }, 150);

      return () => clearTimeout(timeoutId);
    });

    const handleResize = () => {
      updatePositions();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [stepIndex, isOpen]);

  const currentAnte = getAnteForRound(1);
  if (!currentAnte) return null;

  if (!isOpen) return null;

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const mockHandlers = {
    onCardClick: () => {},
    onCardDoubleClick: () => {},
    onDiscard: () => {},
    onDrawCard: () => {},
    onEndRound: () => {},
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.gameplayContainer}>
        <GameplayPage
          gameState={displayGameState}
          currentAnte={currentAnte}
          {...mockHandlers}
          isWalkthrough={true}
        />
      </div>

      {highlightPosition && (() => {
        const element = document.querySelector(`[data-walkthrough="${currentStep.highlightElement}"]`);
        if (!element) return null;
        const elementRect = element.getBoundingClientRect();

        const getBorderRadius = () => {
          const roundedElements = ['discard-button', 'end-round-button', 'deck'];
          return roundedElements.includes(currentStep.highlightElement || '') ? '6px' : '';
        };

        return (
          <>
            <div
              className={styles.highlight}
              style={{
                top: elementRect.top,
                left: elementRect.left,
                width: elementRect.width,
                height: elementRect.height,
                borderRadius: getBorderRadius(),
              }}
            />
            <Overlay elementRect={elementRect} />
          </>
        );
      })()}

      <WalkthroughModal
        title={currentStep.title}
        text={currentStep.text}
        stepIndex={stepIndex}
        totalSteps={STEPS.length}
        onNext={() => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))}
        onBack={() => setStepIndex((i) => Math.max(i - 1, 0))}
        onClose={onClose}
        isLastStep={isLastStep}
        position={null}
      />
    </div>
  );
};
