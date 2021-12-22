import React from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import EquipmentItemCard from 'components/EquipmentItem/EquipmentItem';
import { CartItem } from 'types/Equipment';

import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';

const Cart: React.FC = () => {
  const cartItems: { [itemID: number]: CartItem } = useSelector(
    (state: RootStateOrAny) => {
      return state.cart.cartItems;
    }
  );
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '10px',
        flexDirection: 'column',
        height: '85vh',
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center', margin: '10px' }}>
        Equipment Cart
      </Typography>
      <Stack
        spacing={0.5}
        divider={<Divider />}
        sx={{ flexGrow: 1, overflow: 'scroll', marginBottom: '5px' }}
      >
        {cartItems &&
          Object.entries(cartItems).map(([itemID, cartItem]) => (
            <EquipmentItemCard item={cartItem.item} cartDisplay />
          ))}
      </Stack>
      <Button
        variant="contained"
        sx={{
          alignSelf: 'end',
          width: '100%',
          borderRadius: '20px',
        }}
      >
        Check Out
      </Button>
    </Paper>
  );
};

export default Cart;
