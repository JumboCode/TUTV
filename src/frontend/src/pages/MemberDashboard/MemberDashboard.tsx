import React from 'react';
import { Link } from 'react-router-dom';
import Requests from './Requests';
import Button from '../../components/Button';

const MemberDashboard: React.FC = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <Link to="/Home">
        <Button onClick={() => null}>New Request</Button>
      </Link>
      <Requests />
    </div>
  );
};

export default MemberDashboard;
