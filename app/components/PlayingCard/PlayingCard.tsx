'use client';

import { Paper } from '@mui/material';
import { Card as CardType, CATEGORY_ICONS, CATEGORY_NAMES } from '@/lib/types/card';
import styles from './PlayingCard.module.css';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export const PlayingCard = ({ card, isSelected = false, onClick, onDoubleClick }: CardProps) => {
  const categoryClass = {
    positive: styles.cardPositive,
    neutral: styles.cardNeutral,
    negative: styles.cardNegative,
    wild: styles.cardWild,
  }[card.traitCategory];

  const cardClass = `${styles.card} ${categoryClass} ${isSelected ? styles.cardSelected : ''}`;

  const categoryLabel = CATEGORY_NAMES[card.traitCategory];
  const ariaLabel = `${card.name}, ${categoryLabel} trait${isSelected ? ', selected' : ''}. Click to select, double click to apply as trait`;

  return (
    <Paper
      elevation={isSelected ? 8 : 2}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      title={`${card.name} - Double click to apply as trait`}
      className={cardClass}
    >
      <div className={styles.categoryIcon} aria-hidden="true">
        {CATEGORY_ICONS[card.traitCategory]}
      </div>
      <div className={styles.traitName}>
        {card.name.split(' ').map((word, i) => (
          <span key={i}>{word}</span>
        ))}
      </div>
      <div className={styles.categoryName} aria-label={categoryLabel}>
        {CATEGORY_NAMES[card.traitCategory]}
      </div>
    </Paper>
  );
};
