import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { StoreProvider } from './store';
import LoginShield from 'components/LoginShield';
import { Provider as ReduxProvider } from 'react-redux';
import reduxStore from './redux/store';

// Components for pages of the app
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import NewRequest from './pages/NewRequest';
import EquipmentBrowser from './pages/EquipmentBrowser';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestSummary from './pages/RequestSummary';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const App: React.FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#3e8ede',
      },
      secondary: {
        main: '#2c2c2c',
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <ReduxProvider store={reduxStore}>
            <StoreProvider>
              <LoginShield fallback={<SignIn />}>
                <Navbar />
                <div className="content">
                  <Switch>
                    <Route path="/admin/dashboard">
                      <AdminDashboard />
                    </Route>
                    <Route path="/catalog">
                      <Catalog />
                    </Route>
                    <Route path="/memberdashboard">
                      <MemberDashboard />
                    </Route>
                    <Route path="/request/new">
                      <NewRequest />
                    </Route>
                    <Route path="/request/browser">
                      <EquipmentBrowser />
                    </Route>
                    <Route path="/request/summary">
                      <RequestSummary />
                    </Route>
                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
                </div>
              </LoginShield>
            </StoreProvider>
          </ReduxProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
