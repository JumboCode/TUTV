import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Add, Remove } from '@mui/icons-material';

interface CounterProps {
  startingCount?: number;
  maxCount?: number;
  onChange?: (arg0: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  startingCount = 0,
  maxCount = 100,
  onChange,
}) => {
  const [count, setCount] = useState(startingCount);

  // need to add [count] as a dependency so that we don't run into infinite loop
  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count]);

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
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: '20px',
      }}
    >
      <Stack direction="row" justifyContent="space-around" alignItems="center">
        <IconButton
          color="warning"
          disabled={!canDecrement}
          onClick={handleDecrement}
          sx={{ width: '30px', height: '30px' }}
        >
          <Remove />
        </IconButton>
        <Typography
          variant="body1"
          sx={{
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
          sx={{ width: '30px', height: '30px' }}
        >
          <Add />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Counter;
