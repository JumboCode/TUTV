import React from 'react';
import { EquipmentItem } from 'types/Equipment';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import EquipmentItemCard from 'components/EquipmentItem';
interface EquipmentItemGridProps {
  items?: EquipmentItem[];
}

const EquipmentItemGrid: React.FC<EquipmentItemGridProps> = ({ items }) => {
  return (
    <Grid container spacing={2}>
      {items &&
        items.map((item) => (
          <Grid item xs={12} md={4} xl={3}>
            <Paper variant="elevation">
              <EquipmentItemCard item={item} />
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};

export default EquipmentItemGrid;
