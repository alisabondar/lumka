'use client';

import { Paper } from '@mui/material';
import { Card as CardType } from '@/lib/types/card';
import { SUIT_SYMBOLS, TRAIT_SYMBOLS } from '@/lib/types/card';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export const Card = ({ card, isSelected = false, onClick, onDoubleClick }: CardProps) => {
  const cardClass = `${styles.card} ${card.color === 'red' ? styles.cardRed : styles.cardBlack} ${isSelected ? styles.cardSelected : ''}`;

  return (
    <Paper
      elevation={isSelected ? 8 : 2}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={`${card.rank} of ${card.suit} - Double click to apply as trait`}
      className={cardClass}
    >
      <div className={styles.traitSymbol}>
        {TRAIT_SYMBOLS[card.traitCategory]}
      </div>
      <div className={styles.suitSymbol}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={styles.rankText}>
        {card.rank}
      </div>
    </Paper>
  );
};
