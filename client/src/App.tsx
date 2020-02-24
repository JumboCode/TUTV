import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// Components for pages of the app
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import EquipmentBrowser from './pages/EquipmentBrowser';
import MemberDashboard from './pages/MemberDashboard';
import RequestSummary from './pages/admin/RequestSummary';

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
              <Link to="/memberdashboard">MemberDashboard</Link>
            </li>
            <li>
              <Link to="/admin/equipment-request">Equipment Request</Link>
            </li>
          </ul>
        </nav>

        <Switch>
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
    </Router>
  );
};

export default App;
