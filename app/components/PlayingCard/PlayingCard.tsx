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

  return (
    <Paper
      elevation={isSelected ? 8 : 2}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={`${card.name} - Double click to apply as trait`}
      className={cardClass}
    >
      <div className={styles.categoryIcon}>
        {CATEGORY_ICONS[card.traitCategory]}
      </div>
      <div className={styles.traitName}>
        {card.name.split(' ').map((word, i) => (
          <span key={i}>{word}</span>
        ))}
      </div>
      <div className={styles.categoryName}>
        {CATEGORY_NAMES[card.traitCategory]}
      </div>
    </Paper>
  );
};
