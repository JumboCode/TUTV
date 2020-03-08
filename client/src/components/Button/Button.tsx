import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  onClick?: () => any;
  children?: React.ReactNode;
  variant?: 'blue' | 'gray';
  compact?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'blue',
  compact = false
}) => {
  let styleClass = styles.blue;

  switch (variant) {
    case 'blue':
      styleClass = styles.blue;
      break;
    case 'gray':
      styleClass = styles.gray;
  }

  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${styleClass} ${compact && styles.compact}`}
    >
      {children}
    </button>
  );
};

export default Button;
