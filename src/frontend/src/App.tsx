import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// Components for pages of the app
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import MemberDashboard from './pages/MemberDashboard';

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
              <Link to="/MemberDashboard">Member Dashboard</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/MemberDashboard">
            <MemberDashboard />
          </Route>
          <Route path="/catalog">
            <Catalog />
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
