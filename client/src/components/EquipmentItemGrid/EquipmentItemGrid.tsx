import React from 'react';
import styles from './EquipmentItemGrid.module.css';
import { EquipmentItem } from 'types/Equipment';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Counter from 'components/Counter';

interface EquipmentItemGridProps {
  items: EquipmentItem[];
}

const EquipmentItemGrid: React.FC<EquipmentItemGridProps> = ({ items }) => {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item lg={4}>
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
              <Typography variant="body2">
                {item.num_instances} remaining
              </Typography>
              <Counter />
              <Box></Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default EquipmentItemGrid;
