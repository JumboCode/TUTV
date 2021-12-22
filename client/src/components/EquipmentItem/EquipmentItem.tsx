import React from 'react';
import { EquipmentItem } from 'types/Equipment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Counter from 'components/Counter';
import Button from 'components/Button';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, adjustQty } from '../../redux';
interface EquipmentItemProps {
  item: EquipmentItem;
  cartDisplay?: boolean;
}

const EquipmentItemCard: React.FC<EquipmentItemProps> = ({
  item,
  cartDisplay = false,
}) => {
  const cartItems = useSelector((state: any) => {
    return state.cart.cartItems;
  });
  const dispatch = useDispatch();

  return (
    <Box
      key={item.name}
      sx={{
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <img
        src={item.image || 'https://via.placeholder.com/150'}
        alt="TODO: support alt text"
        width="40%"
      />
      <Stack
        spacing={0.5}
        sx={{
          paddingLeft: '20px',
          alignSelf: 'center',
          width: '60%',
        }}
      >
        <Typography variant="body1">{item.name}</Typography>
        {!cartDisplay && (
          <Typography variant="body2">
            {item.num_instances} remaining
          </Typography>
        )}
        <Box sx={{ width: '115px' }}>
          {item.id in cartItems ? (
            <Counter
              currentCount={cartItems[item.id].qty}
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
              onClick={() => dispatch(addToCart(item))}
              sx={{ fontSize: '12px', width: '100%' }}
            >
              Add to Cart
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default EquipmentItemCard;
