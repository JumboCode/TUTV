import React from 'react';
import './Sidebar.css';
import Calendar from './Calendar';

const Sidebar: React.FC = () => {
  return (
    <React.Fragment>
      <Calendar />
    </React.Fragment>
  );
};

export default Sidebar;
