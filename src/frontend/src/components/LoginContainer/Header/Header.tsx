import React from 'react';
import './Header.css';
import tutv_logo from './tutv-logo.svg';

const Header: React.FC = () => {
  return (
    <div className="header">
      <img src={tutv_logo} className="TUTV-logo" alt="tutv-logo" />
    </div>
  );
};

export default Header;
