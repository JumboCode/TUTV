import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useApiRequest } from 'api';

import { EquipmentRequest } from 'types/Request';
import { setOverdueRequests, getRequestSortFn } from 'utils/Request';
import RequestCard from 'components/RequestCard';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = React.useState<EquipmentRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState('status');

  // TODO: Apply filtering
  const getRequests = useApiRequest('equipment-requests');
  React.useEffect(() => {
    getRequests()
      .then((requests) => {
        setOverdueRequests(requests);
        setRequests(requests.sort(getRequestSortFn(sortBy)));
        setIsLoading(false);
      })
      // TODO: better error handling
      .catch((error) => console.error(error));
  }, []);

  const handleSort = (event: SelectChangeEvent) => {
    let sortBy: string = event.target.value;
    setSortBy(sortBy);
    setRequests(requests.sort(getRequestSortFn(sortBy)));
  };

  return (
    <Stack
      spacing={2}
      sx={{
        width: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '50px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">Member Requests</Typography>
        <Box sx={{ minWidth: '250px' }}>
          <FormControl fullWidth>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={sortBy}
              label="Sort By"
              onChange={handleSort}
            >
              <MenuItem value={'status'}>Status</MenuItem>
              <MenuItem value={'user'}>Member</MenuItem>
              <MenuItem value={'project'}>Project</MenuItem>
              <MenuItem value={'timestamp'}>Request Creation Time</MenuItem>
              <MenuItem value={'request_out'}>Requested Checkout Time</MenuItem>
              <MenuItem value={'request_in'}>Requested Return Time</MenuItem>
              <MenuItem value={'actual_out'}>Actual Checkout Time</MenuItem>
              <MenuItem value={'actual_in'}>Actual Return Time</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {isLoading ? (
        <Box sx={{ alignSelf: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {requests.length !== 0 &&
            requests.map((request: EquipmentRequest) => (
              <RequestCard request={request}></RequestCard>
            ))}
        </Stack>
      )}
    </Stack>
  );
};

export default AdminDashboard;
