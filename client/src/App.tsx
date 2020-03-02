import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// Components for pages of the app
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import EquipmentBrowser from './pages/EquipmentBrowser';
import AdminDashboard from './pages/AdminDashboard';
import RequestSummary from './pages/admin/RequestSummary';
import SignIn from './pages/SignIn';

const App: React.FC = () => {
  return (
    <Router>
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
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/equipment-request">Equipment Request</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/admin-dashboard">
            <AdminDashboard />
          </Route>
          <Route path="/catalog">
            <Catalog />
          </Route>
          <Route path="/equipmentbrowser">
            <EquipmentBrowser />
          </Route>
          <Route path="/admin/equipment-request">
            <RequestSummary />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
