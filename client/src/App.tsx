import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useStore, StoreProvider } from './store';
import LoginShield from 'components/LoginShield';

import Button from 'components/Button';

// Components for pages of the app
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import EquipmentBrowser from './pages/EquipmentBrowser';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestSummary from './pages/admin/RequestSummary';
import SignIn from './pages/SignIn';

const App: React.FC = () => {
  return (
    <Router>
      <StoreProvider>
        <LoginShield fallback={<SignIn />}>
          <div className="App">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/catalog">Equipment Catalog</Link>
                </li>
                <li>
                  <Link to="/equipmentbrowser">Equipment Browser</Link>
                </li>
                <li>
                  <Link to="/memberdashboard">MemberDashboard</Link>
                </li>
                <li>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/equipment-request">Equipment Request</Link>
                </li>
              </ul>
            </nav>

            {React.createElement(function LogOutButton() {
              const { dispatch } = useStore();
              const logout = () => dispatch({ type: 'logout' });
              return (
                <Button variant="gray" onClick={logout}>
                  Log out
                </Button>
              );
            })}

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
        </LoginShield>
      </StoreProvider>
    </Router>
  );
};

export default App;
