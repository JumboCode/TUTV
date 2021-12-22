import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Add, Remove } from '@mui/icons-material';

interface CounterProps {
  currentCount?: number;
  maxCount?: number;
  onChange?: (arg0: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  currentCount = 0,
  maxCount = 100,
  onChange,
}) => {
  const canDecrement = currentCount > 0;
  const canIncrement = currentCount < maxCount;

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
          onClick={() => onChange && onChange(currentCount - 1)}
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
          {currentCount}
        </Typography>
        <IconButton
          color="primary"
          disabled={!canIncrement}
          onClick={() => onChange && onChange(currentCount + 1)}
          sx={{ width: '30px', height: '30px' }}
        >
          <Add />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Counter;
