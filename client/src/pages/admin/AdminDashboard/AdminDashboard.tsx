import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { useApiRequest } from 'api';

import { EquipmentRequest } from 'types/Request';
import RequestCard from 'components/RequestCard';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = React.useState<EquipmentRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // TODO: Apply filtering
  const getRequests = useApiRequest('equipment-requests');
  React.useEffect(() => {
    getRequests()
      .then((requests) => {
        setRequests(requests);
        setIsLoading(false);
      })
      // TODO: better error handling
      .catch((error) => console.error(error));
  }, []);

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
