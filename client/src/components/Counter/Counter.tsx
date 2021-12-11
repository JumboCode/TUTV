import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Add, Remove } from '@mui/icons-material';

interface CounterProps {
  startingCount?: number;
  maxCount?: number;
}

const Counter: React.FC<CounterProps> = ({
  startingCount = 0,
  maxCount = 100,
}) => {
  const [count, setCount] = React.useState(startingCount);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const canDecrement = count > 0;
  const canIncrement = count < maxCount;

  return (
    <Box
      sx={{
        marginTop: '10px',
        display: 'inline-flex',
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
          minWidth: '20px',
          minHeight: '20px',
          textAlign: 'center',
          verticalAlign: 'middle',
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
