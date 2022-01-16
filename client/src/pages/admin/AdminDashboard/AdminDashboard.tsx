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
import RequestCard from 'components/RequestCard';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = React.useState<EquipmentRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState('timestamp');

  const getRequestSortFn = (sortBy: string) => {
    return (a: EquipmentRequest, b: EquipmentRequest): number => {
      switch (sortBy) {
        case 'timestamp':
          return -a.timestamp.localeCompare(b.timestamp);
        case 'request_out':
          return -a.request_out.localeCompare(b.request_out);
        case 'request_in':
          return -a.request_in.localeCompare(b.request_in);
        case 'actual_out':
          if (a.actual_out === null && b.actual_out === null) {
            return 0;
          } else if (a.actual_out === null) {
            return -1;
          } else if (b.actual_out === null) {
            return 1;
          } else {
            return -a.actual_out.localeCompare(b.actual_out);
          }
        case 'actual_in':
          if (a.actual_in === null && b.actual_in === null) {
            return 0;
          } else if (a.actual_in === null) {
            return -1;
          } else if (b.actual_in === null) {
            return 1;
          } else {
            return -a.actual_in.localeCompare(b.actual_in);
          }
        case 'status':
          const statusPriority = {
            Overdue: 1,
            Requested: 2,
            Confirmed: 3,
            'Signed Out': 4,
            Returned: 5,
            Cancelled: 6,
          };
          return statusPriority[a.status] > statusPriority[b.status] ? 1 : -1;
        case 'project':
          return a.project > b.project ? 1 : -1;
        case 'user':
          return a.user > b.user ? 1 : -1;
        default:
          return 0;
      }
    };
  };

  // TODO: Apply filtering
  const getRequests = useApiRequest('equipment-requests');
  React.useEffect(() => {
    getRequests()
      .then((requests) => {
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
    <Stack spacing={2} sx={{ minWidth: '50%', marginBottom: '50px' }}>
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
