import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import RequestInfo from 'components/RequestInfo';

import { CartItem } from 'types/Equipment';

import { RootStateOrAny, useSelector } from 'react-redux';
import { useApiRequest } from 'api';

const RequestSummary = () => {
  const [projectName, checkoutTime, returnTime, cartItems]: [
    string,
    Date,
    Date,
    { [itemID: number]: CartItem }
  ] = useSelector((state: RootStateOrAny) => {
    return [
      state.cart.projectName,
      state.cart.checkoutTime,
      state.cart.returnTime,
      state.cart.cartItems,
    ];
  });

  const submitRequest = useApiRequest('equipment-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project: projectName,
      request_out: checkoutTime,
      request_in: returnTime,
      equipment_items: Object.entries(cartItems).map(([itemID, cartItem]) => {
        return { item_id: itemID, quantity: cartItem.qty };
      }),
    }),
  });

  const onSubmitRequest = () => {
    submitRequest()
      .then((data) => {
        // TODO: redirect to error page if POST failed
        console.log(data);
      })
      .catch((error) => {
        alert('Something bad happened');
        console.error(error);
      });
  };

  return (
    <Stack sx={{ width: '50%' }} spacing={2}>
      <Stack direction="row" spacing={3}>
        <IconButton component={Link} to={'/request/browser'}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ alignSelf: 'center' }}>
          Request Summary
        </Typography>
      </Stack>
      <Typography variant="subtitle1">
        This is a spaceholder for any missing equipment reminders (e.g. a tripod
        is checked out with no tripod plate).
      </Typography>
      <RequestInfo orientation="column" readOnly />
      <Stack spacing={1} divider={<Divider />}>
        {cartItems &&
          Object.entries(cartItems).map(([itemID, { item, qty }]) => (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt="TODO: support alt text"
                  width="50px"
                />
                <Typography variant="body1">{item.name}</Typography>
              </Stack>
              <Typography variant="subtitle2">x {qty}</Typography>
            </Stack>
          ))}
      </Stack>
      <Button
        variant="contained"
        onClick={onSubmitRequest}
        component={Link}
        to={'/request/confirmation'}
      >
        Submit Request
      </Button>
    </Stack>
  );
};

export default RequestSummary;
