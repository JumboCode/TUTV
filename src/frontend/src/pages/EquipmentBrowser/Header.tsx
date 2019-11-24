import React from 'react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <div>
      <span>Checkout time Return time</span>
      <Link to="/Home">
        <Button onClick={() => null}>Cancel Request</Button>
      </Link>
      <Link to="/Home">
        <Button onClick={() => null}>Continue</Button>
      </Link>
    </div>
  );
};

export default Header;
