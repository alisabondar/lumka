'use client';

import { useState, useEffect, useRef } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { GradientButton } from '../components/GradientButton';
import { saveScore, getTopScores } from '@/lib/scoreboard';
import type { ScoreboardEntry } from '@/lib/types/scoreboard';
import { normalizePlayerName } from '@/lib/utilsAndConstants';
import styles from './OutcomePage.module.css';

const TOP_SCORES_LIMIT = 5;

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
      const scores = await getTopScores(TOP_SCORES_LIMIT);
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
          name: normalizePlayerName(playerName),
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

          const scores = await getTopScores(TOP_SCORES_LIMIT);
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
    : scoreboard.some(s => s.name === normalizePlayerName(playerName) && s.level === level);

  const shouldShowPlayerEntry = playerName && !isPlayerInTop5 && scoreboard.length > 0;

  return (
    <main className={styles.container} aria-label={won ? "Game won" : "Game lost"}>
      <Container maxWidth="md">
        <Paper elevation={24} className={styles.outcomeCard}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            className={`${styles.title} ${won ? styles.titleWin : styles.titleLose}`}
          >
            {won ? 'Congrats, you clever fox!' : "Hmmm... not sly enough!"}
          </Typography>
          <Typography variant="h5" className={styles.subtitle} component="p">
            {won
              ? "You've successfully evolved through all 6 rounds!"
              : 'You failed to meet the challenge requirements.'}
          </Typography>

          <Box className={styles.scoreboardBox} role="region" aria-label="Leaderboard">
            <Typography variant="h5" className={styles.scoreboardTitle} component="h2">
              <span aria-hidden="true">🏆</span> Leaderboard
            </Typography>
            {saving && !scoreSaved ? (
              <Typography variant="body2" className={styles.savingMessage} role="status" aria-live="polite">
                Saving score...
              </Typography>
            ) : loadingScores ? (
              <Typography role="status" aria-live="polite">Loading...</Typography>
            ) : scoreboard.length === 0 ? (
              <Typography className={styles.noScores}>No scores yet. Be the first!</Typography>
            ) : (
              <ol className={styles.scoreboardList} aria-label="Top scores">
                {scoreboard.slice(0, TOP_SCORES_LIMIT).map((entry, index) => (
                  <li
                    key={entry.id || index}
                    className={`${styles.scoreboardEntry} ${isCurrentPlayer(entry.id) ? styles.currentPlayer : ''}`}
                    aria-label={`Rank ${index + 1}: ${entry.name}, Level ${entry.level}, ${entry.difficulty} difficulty${isCurrentPlayer(entry.id) ? ', your score' : ''}`}
                  >
                    <span className={styles.rank} aria-hidden="true">#{index + 1}</span>
                    <span className={styles.entryName}>{entry.name}</span>
                    <span className={styles.challengeInfo}>
                      Level {entry.level}
                    </span>
                    <span className={styles.difficulty}>{entry.difficulty}</span>
                  </li>
                ))}

                {shouldShowPlayerEntry && (
                  <li className={`${styles.scoreboardEntry} ${styles.shadowedPlayer}`} aria-label={`Your score: ${playerName}, Level ${level}, ${difficulty} difficulty`}>
                    <span className={styles.entryName}>{playerName}</span>
                    <span className={styles.challengeInfo}>
                      Level {level}
                    </span>
                    <span className={styles.difficulty}>{difficulty}</span>
                  </li>
                )}
              </ol>
            )}
          </Box>

          <GradientButton size="large" onClick={onPlayAgain} aria-label="Start a new game">
            Play Again
          </GradientButton>
        </Paper>
      </Container>
    </main>
  );
};
