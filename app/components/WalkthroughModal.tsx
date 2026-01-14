'use client';

import { Paper, Typography, Button, LinearProgress } from '@mui/material';
import { GradientButton } from './GradientButton';
import styles from './WalkthroughModal.module.css';

interface WalkthroughModalProps {
  title: string;
  text: string;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  isLastStep: boolean;
  position?: { top?: number; bottom?: number; left?: number; right?: number } | null;
}

export const WalkthroughModal = ({
  title,
  text,
  stepIndex,
  totalSteps,
  onNext,
  onBack,
  onClose,
  isLastStep,
  position,
}: WalkthroughModalProps) => {
  const modalStyle: React.CSSProperties = position && Object.keys(position).length > 0
    ? {
        position: 'fixed',
        ...position,
        margin: 0,
      }
    : {};

  return (
    <>
      <div className={styles.overlay} />
      <Paper
        elevation={24}
        className={styles.modal}
        style={modalStyle}
      >
        <div className={styles.progressContainer}>
          <LinearProgress
            variant="determinate"
            value={((stepIndex + 1) / totalSteps) * 100}
            className={styles.progress}
            style={{ backgroundColor: '#e0e0e0' }}
          />
        </div>

        <Typography
          variant="h5"
          gutterBottom
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          className={styles.text}
        >
          {text}
        </Typography>

        <div className={styles.buttonRow}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={stepIndex === 0}
            fullWidth
            className={styles.backButton}
          >
            Back
          </Button>

          <GradientButton
            onClick={isLastStep ? onClose : onNext}
            fullWidth
            className={styles.nextButton}
          >
            {isLastStep ? 'Start Game' : 'Next'}
          </GradientButton>
        </div>
      </Paper>
    </>
  );
};
