import React from 'react';

interface ButtonProps {
  children: Array<Element>;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>;
};

export default Button;
