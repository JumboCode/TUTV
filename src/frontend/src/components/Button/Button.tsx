import React from 'react';

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  if (typeof onClick === undefined) {
    return <button>{children}</button>;
  }
  return <button onClick={onClick}>{children}</button>;
};

export default Button;
