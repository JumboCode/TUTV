import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'blue' | 'gray';
  compact?: boolean;
  pill?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'blue',
  compact = false,
  pill = false,
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
      className={`${styles.btn} ${styleClass} ${compact &&
        styles.compact} ${pill && styles.pill}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
