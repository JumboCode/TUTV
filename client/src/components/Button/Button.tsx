import React from 'react';
import {
  default as MUIButton,
  ButtonProps as MUIButtonProps,
} from '@mui/material/Button';

interface ButtonProps extends MUIButtonProps {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, sx, ...rest }) => {
  return (
    <MUIButton
      variant="contained"
      sx={{ borderRadius: '50px', ...sx }}
      {...rest}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
