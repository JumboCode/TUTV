import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import RequestInfo from 'components/RequestInfo';
import EquipmentTypes from 'components/EquipmentTypes';
import Cart from 'components/Cart';

import { EquipmentCategory } from 'types/Equipment';
import { useApiRequest } from 'api';

const EquipmentBrowser: React.FC = () => {
  const [equipment, setEquipment] = React.useState<Array<EquipmentCategory>>(
    []
  );
  const [tabValue, setTabValue] = React.useState<string>('Camera');

  const getEquipment = useApiRequest('equipment-categories');
  React.useEffect(() => {
    getEquipment()
      .then((data) => {
        setEquipment(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3}>
              <IconButton component={Link} to={'/newrequest'}>
                <ArrowBackIcon />
              </IconButton>
              <RequestInfo orientation="row" readOnly></RequestInfo>
            </Stack>
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
