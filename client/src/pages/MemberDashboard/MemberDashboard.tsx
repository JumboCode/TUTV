import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { EquipmentRequest } from 'types/Request';

import { useApiRequest } from 'api';
import RequestCard from 'components/RequestCard';

const MemberDashboard: React.FC = () => {
  const [requests, setRequests] = React.useState<EquipmentRequest[]>([]);
  const getRequests = useApiRequest('equipment-requests');
  React.useEffect(() => {
    getRequests()
      .then((data) => {
        setRequests(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Stack spacing={2} sx={{ minWidth: '50%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">My Requests</Typography>
        <Button
          variant="contained"
          sx={{ alignSelf: 'flex-end', width: '150px' }}
          component={Link}
          to={'/request/new'}
        >
          New Request
        </Button>
      </Box>
      {requests.map((request: EquipmentRequest) => (
        <RequestCard request={request}></RequestCard>
      ))}
      <Divider>
        <Button>View Inactive Requests</Button>
      </Divider>
    </Stack>
  );
};

export default MemberDashboard;
