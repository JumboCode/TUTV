import React from 'react';
import styles from './EquipmentBrowser.module.css';
import Button from '@mui/material/Button';
import Item from 'types/Item';
import EquipmentGrid from 'components/EquipmentGrid';

import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const EquipmentBrowser: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [tabValue, setTabValue] = React.useState<string>('camera');

  React.useEffect(() => {
    fetch('https://tutv-mock.now.sh/api/v1/equipment/')
      .then((response) => response.json())
      .then((response) => setItems(response.data))
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
                    <Tab label="Camera" value="camera" />
                    <Tab label="Lenses" value="lenses" />
                    <Tab label="Audio" value="audio" />
                    <Tab label="Lighting" value="lighting" />
                    <Tab label="Stablizers" value="stablizers" />
                    <Tab label="Misc" value="misc" />
                  </TabList>
                </Box>
                <TabPanel value="camera">
                  Items should be displayed below:
                  <EquipmentGrid items={items} />
                </TabPanel>
                <TabPanel value="lenses">
                  Items should be displayed below:
                  <EquipmentGrid items={items} />
                </TabPanel>
                <TabPanel value="audio">
                  Items should be displayed below:
                  <EquipmentGrid items={items} />
                </TabPanel>
                <TabPanel value="lighting">
                  Items should be displayed below:
                  <EquipmentGrid items={items} />
                </TabPanel>
                <TabPanel value="stablizers">
                  Items should be displayed below:
                  <EquipmentGrid items={items} />
                </TabPanel>
                <TabPanel value="misc">
                  Items should be displayed below:
                  <EquipmentGrid items={items} />
                </TabPanel>
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
