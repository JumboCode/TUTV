import React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Requests from './Requests';
import Button from '../../components/Button';

const MemberDashboard: React.FC = () => {
  return (
    <div>
      <Link to="/Home">
        <Button>New Request</Button>
      </Link>
      <Requests />
    </div>
  );
};

export default MemberDashboard;
