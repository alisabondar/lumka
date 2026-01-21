"use client";

import { useState } from "react";
import { Box, Container, Typography, TextField } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { WalkthroughWrapper } from "../components/WalkthroughModal";
import { GradientButton } from "../components/GradientButton";
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
      onStart(playerName.trim());
    }
  };

  const handleWalkthroughClose = () => {
    localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
    setShowWalkthrough(false);
    setTimeout(() => {
      onStart(playerName.trim());
    }, 100);
  };

  const isNameValid = playerName.trim().length > 0;

  return (
    <>
      {showWalkthrough && (
        <WalkthroughWrapper
          key={modalKey}
          isOpen={showWalkthrough}
          onClose={handleWalkthroughClose}
        />
      )}
      <Box className={`${styles.pageContainer} ${showWalkthrough ? styles.fading : ''}`}>
        <Container maxWidth="md" className={styles.contentContainer}>
          <Typography variant="h1" className={styles.title}>
            🐾 LUMKA 🐾
          </Typography>

          <Typography variant="h5" className={styles.subtitle}>
            Welcome to Lumka! A game all about growth and evolution in order to
            become an immortal fox. Are you ready to evolve?
          </Typography>

          <Box className={styles.formContainer}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
              className={styles.nameInput}
            />

            <GradientButton
              size="large"
              onClick={handleStartClick}
              disabled={!isNameValid}
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
        />
      </Box>
    </>
  );
};
