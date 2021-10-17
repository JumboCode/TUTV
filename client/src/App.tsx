import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useStore, StoreProvider } from './store';
import LoginShield from 'components/LoginShield';

// Components for pages of the app
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import EquipmentBrowser from './pages/EquipmentBrowser';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestSummary from './pages/admin/RequestSummary';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <StoreProvider>
          <LoginShield fallback={<SignIn />}>
            <Navbar />
            <div className="App">
              <div className="content">
                <Switch>
                  <Route path="/admin/dashboard">
                    <AdminDashboard />
                  </Route>
                  <Route path="/catalog">
                    <Catalog />
                  </Route>
                  <Route path="/equipmentbrowser">
                    <EquipmentBrowser />
                  </Route>
                  <Route path="/memberdashboard">
                    <MemberDashboard />
                  </Route>
                  <Route path="/admin/equipment-request">
                    <RequestSummary />
                  </Route>
                  <Route path="/">
                    <Home />
                  </Route>
                </Switch>
              </div>
            </div>
          </LoginShield>
        </StoreProvider>
      </Router>
    </LocalizationProvider>
  );
};

export default App;
