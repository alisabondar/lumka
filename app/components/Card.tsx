'use client';

import { Paper } from '@mui/material';
import { Card as CardType } from '@/lib/types/card';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  positive: '🩶',
  neutral: '⚙️',
  negative: '⛓️',
  wild: '✨',
};

const CATEGORY_NAMES: Record<string, string> = {
  positive: 'FLOURISH',
  neutral: 'ADAPT',
  negative: 'BURDEN',
  wild: 'CATALYST',
};

export const Card = ({ card, isSelected = false, onClick, onDoubleClick }: CardProps) => {
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
