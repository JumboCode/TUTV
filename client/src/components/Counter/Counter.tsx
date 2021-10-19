import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Add, Remove } from '@mui/icons-material';

const Counter: React.FC = () => {
  const [count, setCount] = React.useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const canDecrement = count > 0;
  const canIncrement = count < 10;

  return (
    <Box
      sx={{
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: '20px',
      }}
    >
      <IconButton
        color="warning"
        disabled={!canDecrement}
        onClick={handleDecrement}
      >
        <Remove />
      </IconButton>
      <Typography
        variant="body1"
        sx={{
          minWidth: '30px',
          minHeight: '30px',
          textAlign: 'center',
          verticalAlign: 'middle',
          paddingTop: '3px',
        }}
      >
        {count}
      </Typography>
      <IconButton
        color="primary"
        disabled={!canIncrement}
        onClick={handleIncrement}
      >
        <Add />
      </IconButton>
    </Box>
  );
};

export default Counter;
