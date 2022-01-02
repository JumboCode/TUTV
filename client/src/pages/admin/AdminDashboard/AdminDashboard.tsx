import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

const AdminDashboard: React.FC = () => {
  const statuses = [
    'Requested',
    'Confirmed',
    'Signed Out',
    'Overdue',
    'Returned',
    'Cancelled',
  ];
  const [statusFilter, setStatusFilter] = React.useState([
    'Requested',
    'Confirmed',
    'Signed Out',
    'Overdue',
  ]);
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value as string[]);
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
      </Box>
    </Stack>
  );
};

export default AdminDashboard;
