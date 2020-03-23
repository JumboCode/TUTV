import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'blue' | 'gray';
  compact?: boolean;
  pill?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'blue',
  compact = false,
  pill = false,
  className = '',
  ...rest
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
      className={`${styles.btn} ${styleClass} ${compact && styles.compact} ${
        pill && styles.pill
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
