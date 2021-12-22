import React from 'react';
import { EquipmentType } from 'types/Equipment';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import EquipmentItemGrid from 'components/EquipmentItemGrid';

interface EquipmentTypesProps {
  types: EquipmentType[];
}

const EquipmentTypes: React.FC<EquipmentTypesProps> = ({ types }) => {
  return (
    <Stack spacing={3}>
      {types.map((type) => (
        <Stack spacing={0.2}>
          <Typography variant="h5">{type.name}</Typography>
          <Typography variant="subtitle1">{type.description}</Typography>
          <Divider />
          <EquipmentItemGrid items={type.items}></EquipmentItemGrid>
        </Stack>
      ))}
    </Stack>
  );
};

export default EquipmentTypes;
