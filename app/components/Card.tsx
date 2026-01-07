'use client';

import { Card as CardType } from '@/lib/types/card';
import { SUIT_SYMBOLS, TRAIT_SYMBOLS } from '@/lib/types/card';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function Card({ card, isSelected = false, onClick, onDoubleClick }: CardProps) {
  return (
    <div
      className={`${styles.card} ${styles.cardInHand} ${
        card.color === 'red'
          ? styles.cardRed
          : styles.cardBlack
      } ${isSelected ? styles.cardSelected : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={`${card.rank} of ${card.suit} - Double click to apply as trait`}
    >
      <div className={styles.traitSymbol}>
        {TRAIT_SYMBOLS[card.traitCategory]}
      </div>
      <div className={styles.cardSymbol}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={styles.cardRank}>{card.rank}</div>
    </div>
  );
}

