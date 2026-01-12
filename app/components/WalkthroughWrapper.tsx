"use client";

import { useState, useEffect, useRef } from "react";
import { createDeck, shuffleDeck } from '@/lib/deck';
import { createInitialGameState } from '@/lib/game/gameState';
import { getAnteForRound } from '@/lib/game/challenges';
import type { GameState } from '@/lib/game/gameState';
import { GameplayPage } from '../pages/GameplayPage';
import { WalkthroughModal } from './WalkthroughModal';
import styles from './WalkthroughWrapper.module.css';

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

  // Create a mock game state for demonstration
  const [mockGameState] = useState<GameState>(() => {
    const deck = shuffleDeck(createDeck());
    const state = createInitialGameState(deck);
    // Pre-select a challenge and some cards for the walkthrough
    const ante = getAnteForRound(1);
    if (ante) {
      // Select first card to show discard button
      const selectedCards = new Set([state.hand[0]?.id].filter(Boolean));
      return { ...state, selectedChallengeId: ante.challenges[0].id, selectedCards };
    }
    return state;
  });

  const currentAnte = getAnteForRound(1);
  if (!currentAnte) return null;

  useEffect(() => {
    if (!isOpen) return;

    const currentStep = STEPS[stepIndex];
    if (!currentStep.highlightElement) {
      setHighlightPosition(null);
      return;
    }

    const updatePositions = () => {
      // Find the element to highlight
      const element = document.querySelector(`[data-walkthrough="${currentStep.highlightElement}"]`);
      if (!element || !containerRef.current) {
        setHighlightPosition(null);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // Check if element has valid dimensions
      if (elementRect.width === 0 && elementRect.height === 0) {
        return;
      }

      // Calculate highlight position relative to container
      const highlightPos = {
        top: elementRect.top - containerRect.top,
        left: elementRect.left - containerRect.left,
        width: elementRect.width,
        height: elementRect.height,
      };

      setHighlightPosition(highlightPos);
    };

    // Use requestAnimationFrame and a timeout to ensure DOM is fully rendered
    const frameId = requestAnimationFrame(() => {
      const timeoutId = setTimeout(() => {
        updatePositions();

        // Retry once more after a longer delay in case the first attempt failed
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

  if (!isOpen) return null;

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  // Mock handlers for the gameplay page
  const mockHandlers = {
    onCardClick: () => {},
    onCardDoubleClick: () => {},
    onDiscard: () => {},
    onDrawCard: () => {},
    onEndRound: () => {},
    onSelectChallenge: () => {},
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.gameplayContainer}>
        <GameplayPage
          gameState={mockGameState}
          currentAnte={currentAnte}
          {...mockHandlers}
        />
      </div>

      {highlightPosition && (() => {
        const element = document.querySelector(`[data-walkthrough="${currentStep.highlightElement}"]`);
        if (!element) return null;
        const elementRect = element.getBoundingClientRect();

        return (
          <>
            <div
              className={styles.highlight}
              style={{
                top: elementRect.top,
                left: elementRect.left,
                width: elementRect.width,
                height: elementRect.height,
              }}
            />
            {/* Create overlay masks around the highlight to create spotlight effect */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: `${elementRect.top}px`,
                background: 'rgba(0, 0, 0, 0.75)',
                zIndex: 1001,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: `${elementRect.top}px`,
                left: 0,
                width: `${elementRect.left}px`,
                height: `${elementRect.height}px`,
                background: 'rgba(0, 0, 0, 0.75)',
                zIndex: 1001,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: `${elementRect.top}px`,
                left: `${elementRect.left + elementRect.width}px`,
                right: 0,
                height: `${elementRect.height}px`,
                background: 'rgba(0, 0, 0, 0.75)',
                zIndex: 1001,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: `${elementRect.top + elementRect.height}px`,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                zIndex: 1001,
                pointerEvents: 'none',
              }}
            />
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
