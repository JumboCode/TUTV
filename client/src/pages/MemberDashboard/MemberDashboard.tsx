import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

import { EquipmentRequest } from 'types/Request';

import { useApiRequest } from 'api';
import RequestCard from 'components/RequestCard';

const MemberDashboard: React.FC = () => {
  const [activeRequests, setActiveRequests] = React.useState<
    EquipmentRequest[]
  >([]);
  const [inactiveRequests, setInactiveRequests] = React.useState<
    EquipmentRequest[]
  >([]);
  const [showInactiveRequests, setShowInactiveRequests] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const getRequests = useApiRequest('equipment-requests');
  React.useEffect(() => {
    getRequests()
      .then((requests) => {
        const activeRequests: EquipmentRequest[] = [];
        const inactiveRequests: EquipmentRequest[] = [];
        requests.forEach((request: EquipmentRequest) => {
          if (request.status === 'Returned' || request.status === 'Cancelled') {
            inactiveRequests.push(request);
          } else {
            activeRequests.push(request);
          }
        });
        setActiveRequests(activeRequests);
        setInactiveRequests(inactiveRequests);
        setIsLoading(false);
      })
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
        <Typography variant="h5">My Requests</Typography>
        <Button
          variant="contained"
          sx={{ alignSelf: 'flex-end' }}
          component={Link}
          to={'/request/new'}
          startIcon={<AddIcon />}
        >
          New Request
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ alignSelf: 'center' }}>
          <CircularProgress />
        </Box>
      ) : activeRequests.length === 0 && inactiveRequests.length === 0 ? (
        <Box sx={{ alignSelf: 'center' }}>
          <Typography variant="body1">
            You don't have any equipment request yet...
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {activeRequests.length !== 0 &&
            activeRequests.map((request: EquipmentRequest) => (
              <RequestCard request={request}></RequestCard>
            ))}
          {activeRequests.length !== 0 && inactiveRequests.length !== 0 && (
            <Divider>
              <Button
                onClick={() => setShowInactiveRequests(!showInactiveRequests)}
              >
                {!showInactiveRequests ? 'Show' : 'Hide'} Inactive Requests
              </Button>
            </Divider>
          )}
          {((activeRequests.length === 0 && inactiveRequests.length !== 0) ||
            showInactiveRequests) &&
            inactiveRequests.map((request: EquipmentRequest) => (
              <RequestCard request={request}></RequestCard>
            ))}
        </Stack>
      )}
    </Stack>
  );
};

export default MemberDashboard;
