"use client";

import { useState } from "react";
import styles from "./IntroPage.module.css";
import { WalkthroughWrapper } from "../components/WalkthroughWrapper";

interface IntroPageProps {
  onStart: () => void;
}

export const IntroPage = ({ onStart }: IntroPageProps) => {
  const [playerName, setPlayerName] = useState("");
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleStartClick = () => {
    setModalKey((prev) => prev + 1);
    setShowWalkthrough(true);
  };

  const handleWalkthroughClose = () => {
    setShowWalkthrough(false);
    onStart();
  };

  const isNameValid = playerName.trim().length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.introScreen}>
        <h1 className={styles.introTitle}>🐾 LUMKA 🐾</h1>
        <div className={styles.introContent}>
          <p className={styles.introDescription}>
            Welcome to Lumka! A game all about growth and evolution in order to
            become an immortal cat. Are you ready to evolve?
          </p>
          <WalkthroughWrapper
            key={modalKey}
            isOpen={showWalkthrough}
            onClose={handleWalkthroughClose}
          />
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className={styles.nameInput}
            />
          </div>
          <button
            className={styles.startButton}
            onClick={handleStartClick}
            disabled={!isNameValid}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
