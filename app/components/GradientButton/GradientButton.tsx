'use client';

import { Button, ButtonProps } from '@mui/material';
import styles from './GradientButton.module.css';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
}

export const GradientButton = ({ children, disabled, className, ...props }: GradientButtonProps) => {
  const buttonClass = `${styles.gradientButton} ${disabled ? styles.disabled : ''} ${className || ''}`;

  return (
    <Button
      variant="contained"
      disabled={disabled}
      className={buttonClass}
      {...props}
    >
      {children}
    </Button>
  );
};
