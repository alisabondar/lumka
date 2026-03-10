"use client";

import { useState } from "react";
import { Box, Container, Typography, TextField } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { WalkthroughWrapper } from "../components/WalkthroughModal";
import { GradientButton } from "../components/GradientButton";
import { normalizePlayerName } from "@/lib/utilsAndConstants";
import styles from "./IntroPage.module.css";

interface IntroPageProps {
  onStart: (playerName: string) => void;
}

const WALKTHROUGH_STORAGE_KEY = "lumka_walkthrough_shown";

export const IntroPage = ({ onStart }: IntroPageProps) => {
  const [playerName, setPlayerName] = useState("");
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleStartClick = () => {
    const hasSeenWalkthrough = typeof window !== "undefined"
      ? localStorage.getItem(WALKTHROUGH_STORAGE_KEY) === "true"
      : false;

    if (!hasSeenWalkthrough) {
      setModalKey((prev) => prev + 1);
      setShowWalkthrough(true);
    } else {
      onStart(normalizePlayerName(playerName));
    }
  };

  const handleWalkthroughClose = () => {
    localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
    setShowWalkthrough(false);
    setTimeout(() => {
      onStart(normalizePlayerName(playerName));
    }, 100);
  };

  const isNameValid = normalizePlayerName(playerName).length > 0;

  return (
    <>
      {showWalkthrough && (
        <WalkthroughWrapper
          key={modalKey}
          isOpen={showWalkthrough}
          onClose={handleWalkthroughClose}
        />
      )}
      <Box
        component="main"
        className={`${styles.pageContainer} ${showWalkthrough ? styles.fading : ''}`}
        aria-label="Welcome to Lumka"
      >
        <Container maxWidth="md" className={styles.contentContainer}>
          <Typography variant="h1" className={styles.title} component="h1">
            <span aria-hidden="true">🐾</span> LUMKA <span aria-hidden="true">🐾</span>
          </Typography>

          <Typography variant="h5" className={styles.subtitle} component="p">
            Welcome to Lumka! A game all about growth and evolution in order to
            become an immortal fox. Are you ready to evolve?
          </Typography>

          <Box component="form" className={styles.formContainer} onSubmit={(e) => { e.preventDefault(); handleStartClick(); }}>
            <TextField
              fullWidth
              variant="outlined"
              value={playerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
              className={styles.nameInput}
              label="Player Name"
              aria-label="Enter your player name"
              aria-required="true"
              autoComplete="name"
            />

            <GradientButton
              size="large"
              onClick={handleStartClick}
              disabled={!isNameValid}
              aria-label={isNameValid ? "Start the game" : "Enter your name to start the game"}
            >
              Start Game
            </GradientButton>
          </Box>
        </Container>
        <DotLottieReact
          src="/happy-fox.lottie"
          loop
          autoplay
          className={styles.lottie}
          aria-label="Animated fox character"
          role="img"
        />
      </Box>
    </>
  );
};
