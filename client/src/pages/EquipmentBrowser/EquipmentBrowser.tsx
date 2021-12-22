import React from 'react';
import { EquipmentCategory } from 'types/Equipment';
import EquipmentTypes from 'components/EquipmentTypes';
import Cart from 'components/Cart';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Typography from '@mui/material/Typography';

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
  const [tabValue, setTabValue] = React.useState<string>('Camera');

  React.useEffect(() => {
    fetch(new URL('/api/v1/equipment-categories/', window.location.origin).href)
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
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6">Checking out for:</Typography>
            <Typography variant="body1">Cult 3zza</Typography>
          </Grid>
          <Grid item xs={4}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Checkout Time"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Return Time"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={(event, newValue) => setTabValue(newValue)}
                  >
                    {equipment.map((category: EquipmentCategory) => {
                      return (
                        <Tab
                          key={category.name}
                          label={category.name}
                          value={category.name}
                        />
                      );
                    })}
                  </TabList>
                </Box>
                {equipment.map((category: EquipmentCategory) => {
                  return (
                    <TabPanel
                      key={category.name}
                      value={category.name}
                      sx={{ height: '73vh', overflow: 'scroll' }}
                    >
                      <EquipmentTypes types={category.types}></EquipmentTypes>
                    </TabPanel>
                  );
                })}
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Cart />
      </Grid>
    </Grid>
  );
};

export default EquipmentBrowser;
