import React from 'react';
import styles from './EquipmentItemGrid.module.css';
import { EquipmentItem } from 'types/Equipment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Counter from 'components/Counter';

interface EquipmentItemGridProps {
  items: EquipmentItem[];
}

const EquipmentItemGrid: React.FC<EquipmentItemGridProps> = ({ items }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {items.map((item) => (
        <Paper
          variant="outlined"
          key={item.name}
          sx={{
            padding: '10px',
            margin: '5px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center',
            width: '32%',
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
            <Typography variant="body2">
              {item.num_instances} remaining
            </Typography>
            <Counter />
            <Box></Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default EquipmentItemGrid;
