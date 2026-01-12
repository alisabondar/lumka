"use client";

import { useState } from "react";
import { Box, Container, Typography, TextField } from "@mui/material";
import { WalkthroughWrapper } from "../components/WalkthroughWrapper";
import { GradientButton } from "../components/GradientButton";
import styles from "./IntroPage.module.css";

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
    setTimeout(() => {
      onStart();
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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
          position: "relative",
          backgroundColor: "transparent",
          opacity: showWalkthrough ? 0 : 1,
          transition: "opacity 0.3s ease-out",
          pointerEvents: showWalkthrough ? "none" : "auto",
        }}
      >
      <Container
        maxWidth="md"
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", md: "4rem" },
            fontWeight: 700,
            mb: 2,
            background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffe66d)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          🐾 LUMKA 🐾
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: "rgba(255, 255, 255, 0.95)",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            mb: 2,
            maxWidth: "600px",
          }}
        >
          Welcome to Lumka! A game all about growth and evolution in order to
          become an immortal cat. Are you ready to evolve?
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "400px",
          }}
        >
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
    </Box>
    </>
  );
};
