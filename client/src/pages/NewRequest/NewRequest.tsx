import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import RequestInfo from 'components/RequestInfo';

import { useSelector } from 'react-redux';

const NewRequest = () => {
  const [projectName, checkoutTime, returnTime] = useSelector((state: any) => {
    return [
      state.cart.projectName,
      state.cart.checkoutTime,
      state.cart.returnTime,
    ];
  });

  return (
    <Stack sx={{ width: '50%' }} spacing={2}>
      <Typography variant="h5">Make a new request</Typography>
      <Typography variant="subtitle1">
        Remember that you cannot make a request less than 2 days in advance. You
        also cannot take out equipment for more than 2 days.
      </Typography>
      <RequestInfo orientation="column" />
      <Button
        disabled={!projectName || !checkoutTime || !returnTime}
        variant="contained"
        component={Link}
        to={'/equipmentbrowser'}
      >
        Browse Equipment
      </Button>
    </Stack>
  );
};

export default NewRequest;
