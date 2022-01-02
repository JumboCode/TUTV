import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { EquipmentRequest } from 'types/Request';

interface RequestCardProps {
  request: EquipmentRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <Paper sx={{ padding: '20px', borderRadius: '10px' }} elevation={6}>
      <Stack spacing={0.5}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">{request.project}</Typography>
          <Typography
            variant="body1"
            sx={{ marginTop: '5px', fontWeight: '700' }}
          >
            Pickup: {new Date(request.request_out).toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body1">Status: {request.status}</Typography>
          <Typography variant="body1">
            Due: {new Date(request.request_in).toLocaleString()}
          </Typography>
        </Box>
        <Stack
          spacing={1}
          divider={<Divider />}
          sx={{ marginTop: '20px !important' }}
        >
          {request.equipment_items &&
            request.equipment_items.map(({ item, quantity }) => (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/150'}
                    alt="TODO: support alt text"
                    width="50px"
                  />
                  <Typography variant="body1">{item.name}</Typography>
                </Stack>
                <Typography variant="subtitle2">x {quantity}</Typography>
              </Stack>
            ))}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Button>Modify Request</Button>
          <Button variant="contained">Cancel Request</Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default RequestCard;
