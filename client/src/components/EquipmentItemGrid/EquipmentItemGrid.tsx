import React from 'react';
import { EquipmentItem } from 'types/Equipment';
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
          <Grid item xs={12} md={6} xl={4}>
            <EquipmentItemCard item={item} />
          </Grid>
        ))}
    </Grid>
  );
};

export default EquipmentItemGrid;
