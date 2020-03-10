import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Helmet from 'react-helmet';

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
    <React.StrictMode>
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
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/equipment-request">Equipment Request</Link>
              </li>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
            </ul>
          </nav>

          <Helmet
            titleTemplate="TUTV | %s"
            defaultTitle="TUTV Equipment Borrowing"
          >
            <meta
              name="description"
              content="TUTV is a student-run production studio that strives to foster 
            a supportive and collaborative community where anyone can learn about the 
            filmmaking process and develop their own artistic voice."
            />
          </Helmet>

          <Switch>
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/catalog" component={Catalog} />
            <Route path="/equipmentbrowser" component={EquipmentBrowser} />
            <Route path="/memberdashboard" component={MemberDashboard} />
            <Route path="/admin/equipment-request" component={RequestSummary} />
            <Route path="/signin" component={SignIn} />
            <Route path="/" exact component={Home} />
          </Switch>
        </div>
      </Router>
    </React.StrictMode>
  );
};

export default App;
