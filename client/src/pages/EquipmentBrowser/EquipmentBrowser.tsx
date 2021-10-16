import React from 'react';
import styles from './EquipmentBrowser.module.css';
import Button from '@mui/material/Button';
import { EquipmentCategory } from 'types/Equipment';
import EquipmentTypeAccordion from 'components/EquipmentTypeAccordion';

import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const EquipmentBrowser: React.FC = () => {
  const [equipment, setEquipment] = React.useState<Array<EquipmentCategory>>(
    []
  );
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [tabValue, setTabValue] = React.useState<string>('camera');

  React.useEffect(() => {
    fetch('http://localhost:8000/api/v1/equipment-categories/')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setEquipment(data);
      })
      .catch((error) => console.error(error));
  }, []);

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
        <Button variant="outlined">Cancel Request</Button>
        <Button variant="contained">Continue</Button>
      </div>
      <div>
        <div className={styles.equipmentPage}>
          <div className={styles.wrapper}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={(event, newValue) => setTabValue(newValue)}
                  >
                    {equipment.map((category: EquipmentCategory) => {
                      return (
                        <Tab label={category.name} value={category.name} />
                      );
                    })}
                  </TabList>
                </Box>
                {equipment.map((category: EquipmentCategory) => {
                  return (
                    <TabPanel value={category.name}>
                      <EquipmentTypeAccordion
                        types={category.types}
                      ></EquipmentTypeAccordion>
                    </TabPanel>
                  );
                })}
              </TabContext>
            </Box>
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
