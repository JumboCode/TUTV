import React from 'react';
import { EquipmentItem } from 'types/Equipment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Counter from 'components/Counter';
import Button from 'components/Button';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, adjustQty } from '../../redux';
interface EquipmentItemProps {
  item: EquipmentItem;
}

const EquipmentItemCard: React.FC<EquipmentItemProps> = ({ item }) => {
  const cartItems = useSelector((state: any) => {
    return state.cart.cartItems;
  });
  const dispatch = useDispatch();

  return (
    <Paper
      variant="outlined"
      key={item.name}
      sx={{
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
      }}
    >
      <img
        src={item.image || 'https://via.placeholder.com/150'}
        alt="TODO: support alt text"
        width="50%"
      />
      <Box
        sx={{
          padding: '10px',
          alignSelf: 'center',
          width: '50%',
        }}
      >
        <Typography variant="body1">{item.name}</Typography>
        <Typography variant="body2">{item.num_instances} remaining</Typography>
        {item.id in cartItems ? (
          <Counter
            startingCount={cartItems[item.id]}
            maxCount={item.num_instances}
            onChange={(qty: number) => {
              if (qty === 0) {
                dispatch(removeFromCart(item.id));
              } else {
                dispatch(adjustQty(item.id, qty));
              }
            }}
          />
        ) : (
          <Button
            onClick={() => dispatch(addToCart(item.id))}
            sx={{ width: '100%' }}
          >
            Add to Cart
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EquipmentItemCard;
