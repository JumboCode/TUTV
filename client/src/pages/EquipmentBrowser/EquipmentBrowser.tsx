import React from 'react';
import styles from './EquipmentBrowser.module.css';
import Button from 'components/Button';
import Item from 'types/Item';
import EquipmentGrid from 'components/EquipmentGrid';

import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EquipmentBrowser: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);
  React.useEffect(() => {
    fetch('https://tutv-mock.now.sh/api/v1/equipment/')
      .then((response) => response.json())
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);
  const [value, setValue] = React.useState<Date | null>(new Date());
  return (
    <div>
      <div className={styles.header}>
        <table className={styles.tableClass}>
          <tbody>
            <tr className={styles.projectreq}>
              <td>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Checkout Time"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
              </td>
              <td>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Return Time"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button variant="gray" className={styles.headerButton}>
          Cancel Request
        </Button>
        <Button className={styles.headerButton}>Continue</Button>
      </div>
      <div>
        <div className={styles.equipmentPage}>
          <div className={styles.wrapper}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Camera and Lenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Items should be displayed below:</Typography>
                <EquipmentGrid items={items} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Audio</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Items should be displayed below:</Typography>
                <EquipmentGrid items={items} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography>Lighting</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Items should be displayed below:</Typography>
                <EquipmentGrid items={items} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography>Misc</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Items should be displayed below:</Typography>
                <EquipmentGrid items={items} />
              </AccordionDetails>
            </Accordion>
          </div>
          <div className={styles.cart}>
            <div>
              <div>Equipment Cart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentBrowser;
