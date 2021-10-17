import React from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import styles from './Cart.module.css';

const Cart: React.FC = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '10px',
        flexDirection: 'column',
        minHeight: '85vh',
      }}
    >
      <div className={styles.title}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Equipment Cart
        </Typography>
      </div>
      <Button
        variant="contained"
        sx={{
          marginTop: 'auto',
        }}
      >
        Check Out
      </Button>
    </Paper>
  );
};

export default Cart;
