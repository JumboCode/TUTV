import React, { useState } from 'react';
import { EquipmentItem } from 'types/Equipment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Counter from 'components/Counter';
import Button from 'components/Button';

interface EquipmentItemProps {
  item: EquipmentItem;
}

const EquipmentItemCard: React.FC<EquipmentItemProps> = ({ item }) => {
  const [amountInCart, setAmountInCart] = useState(0);

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
        {amountInCart > 0 ? (
          <Counter startingCount={1} maxCount={item.num_instances} />
        ) : (
          <Button onClick={() => setAmountInCart(1)} sx={{ width: '100%' }}>
            Add to Cart
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default EquipmentItemCard;
