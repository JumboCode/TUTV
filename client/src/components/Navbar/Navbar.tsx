import React from 'react';
import { Link } from 'react-router-dom';

import { useStore } from '../../store';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const { dispatch } = useStore();
  const logout = () => dispatch({ type: 'logout' });

  const linkStyle = {
    margin: '1rem',
    textDecoration: 'none',
    color: 'white',
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TUTV Equipment Checkout
          </Typography>
          <Link style={linkStyle} to="/">
            Home
          </Link>
          <Link style={linkStyle} to="/catalog">
            Catalog
          </Link>
          <Link style={linkStyle} to="/equipmentbrowser">
            Browser
          </Link>
          <Link style={linkStyle} to="/newrequest">
            New Request
          </Link>
          <Link style={linkStyle} to="/memberdashboard">
            Member Dashboard
          </Link>
          {/* <Link style={linkStyle} to="/admin/dashboard">
            Admin Dashboard
          </Link>
          <Link style={linkStyle} to="/admin/equipment-request">
            Admin Equipment Request
          </Link> */}
          <Button variant="contained" color="secondary" onClick={logout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
