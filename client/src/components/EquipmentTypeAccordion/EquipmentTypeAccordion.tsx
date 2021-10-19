import React from 'react';
import { EquipmentType } from 'types/Equipment';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import EquipmentItemGrid from 'components/EquipmentItemGrid';

interface EquipmentTypeAccordionProps {
  types: EquipmentType[];
}

const EquipmentTypeAccordion: React.FC<EquipmentTypeAccordionProps> = ({
  types,
}) => {
  return (
    <div>
      {types.map((type) => (
        <Accordion defaultExpanded key={type.name}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{type.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{type.description}</Typography>
            <EquipmentItemGrid items={type.items}></EquipmentItemGrid>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default EquipmentTypeAccordion;
