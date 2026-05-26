'use client';

import Image from 'next/image';
import { Paper } from '@mui/material';
import { Card as CardType, CATEGORY_ICONS, CATEGORY_NAMES, type FoxVariant } from '@/lib/types/card';
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
  const effectText = card.effectText || `${categoryLabel} trait`;
  const foxVariant: FoxVariant = card.foxVariant || 'bonus';
  const ariaLabel = `${card.name}, ${categoryLabel} trait${isSelected ? ', selected' : ''}. ${effectText} Click to select, double click to apply as trait`;

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
      <div className={styles.cardHeader}>
        <span className={styles.categoryName}>
          {CATEGORY_NAMES[card.traitCategory]}
        </span>
        <span className={styles.categoryIcon} aria-hidden="true">
          {CATEGORY_ICONS[card.traitCategory]}
        </span>
      </div>

      <div className={styles.foxFrame} aria-hidden="true">
        <Image
          src={`/foxes/fox-${foxVariant}.png`}
          alt=""
          width={132}
          height={132}
          className={styles.foxImage}
          draggable={false}
        />
      </div>

      {card.flavorText && (
        <div className={styles.flavorText}>
          {card.flavorText}
        </div>
      )}

      <div className={styles.effectText}>
        {effectText}
      </div>

      <div className={styles.traitName}>
        {card.name}
      </div>
    </Paper>
  );
};
