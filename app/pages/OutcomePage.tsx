'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { GradientButton } from '../components/GradientButton';
import { saveScore, getTopScores } from '@/lib/scoreboard';
import type { ScoreboardEntry } from '@/lib/types/scoreboard';
import styles from './OutcomePage.module.css';

interface OutcomePageProps {
  won: boolean;
  playerName: string;
  level: number;
  difficulty: string;
  onPlayAgain: () => void;
}

export const OutcomePage = ({ won, playerName, level, difficulty, onPlayAgain }: OutcomePageProps) => {
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const hasAttemptedSave = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      const scores = await getTopScores(5);
      if (!cancelled) {
        setScoreboard(scores);
        setLoadingScores(false);
      }
    };

    loadInitialData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!playerName || hasAttemptedSave.current) return;
    hasAttemptedSave.current = true;

    let cancelled = false;

    const saveAndRefresh = async () => {
      setSaving(true);
      try {
        const savedEntry = await saveScore({
          name: playerName.trim(),
          level: level,
          difficulty: difficulty,
        });

        if (cancelled) {
          setSaving(false);
          return;
        }

        if (savedEntry) {
          setScoreSaved(true);
          setSavedEntryId(savedEntry.id ?? null);

          const scores = await getTopScores(5);
          if (cancelled) {
            setSaving(false);
            return;
          }

          setScoreboard(scores);
          setSaving(false);
        } else {
          setSaving(false);
        }
      } catch (error) {
        console.error('Error saving score:', error);
      } finally {
        if (!cancelled) {
          setSaving(false);
        }
      }
    };

    saveAndRefresh();
    return () => { cancelled = true; };
  }, [playerName, level, difficulty]);

  const isCurrentPlayer = (entryId: string | undefined) => {
    return savedEntryId && entryId === savedEntryId;
  };

  const isPlayerInTop5 = savedEntryId
    ? scoreboard.some(s => s.id === savedEntryId)
    : scoreboard.some(s => s.name === playerName.trim() && s.level === level);

  const shouldShowPlayerEntry = playerName && !isPlayerInTop5 && scoreboard.length > 0;

  return (
    <div className={styles.container}>
      <Container maxWidth="md">
        <Paper elevation={24} className={styles.outcomeCard}>
          <Typography
            variant="h2"
            gutterBottom
            className={`${styles.title} ${won ? styles.titleWin : styles.titleLose}`}
          >
            {won ? 'Congrats, you clever fox!' : "Hmmm... not sly enough!"}
          </Typography>
          <Typography variant="h5" className={styles.subtitle}>
            {won
              ? "You've successfully evolved through all 6 rounds!"
              : 'You failed to meet the challenge requirements.'}
          </Typography>

          <Box className={styles.scoreboardBox}>
            <Typography variant="h5" className={styles.scoreboardTitle}>
              🏆 Leaderboard
            </Typography>
            {saving && !scoreSaved ? (
              <Typography variant="body2" className={styles.savingMessage}>
                Saving score...
              </Typography>
            ) : loadingScores ? (
              <Typography>Loading...</Typography>
            ) : scoreboard.length === 0 ? (
              <Typography className={styles.noScores}>No scores yet. Be the first!</Typography>
            ) : (
              <div className={styles.scoreboardList}>
                {scoreboard.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className={`${styles.scoreboardEntry} ${isCurrentPlayer(entry.id) ? styles.currentPlayer : ''}`}
                  >
                    <span className={styles.rank}>#{index + 1}</span>
                    <span className={styles.entryName}>{entry.name}</span>
                    <span className={styles.challengeInfo}>
                      Level {entry.level}
                    </span>
                    <span className={styles.difficulty}>{entry.difficulty}</span>
                  </div>
                ))}

                {shouldShowPlayerEntry && (
                  <div className={`${styles.scoreboardEntry} ${styles.shadowedPlayer}`}>
                    <span className={styles.entryName}>{playerName}</span>
                    <span className={styles.challengeInfo}>
                      Level {level}
                    </span>
                    <span className={styles.difficulty}>{difficulty}</span>
                  </div>
                )}
              </div>
            )}
          </Box>

          <GradientButton size="large" onClick={onPlayAgain}>
            Play Again
          </GradientButton>
        </Paper>
      </Container>
    </div>
  );
};
