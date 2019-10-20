import React from 'react';
import MainContent from './MainContent';
import Sidebar from './Sidebar';

const TotalContainer: React.FC = () => {
  return (
    <React.Fragment>
      <MainContent />
      <Sidebar />
    </React.Fragment>
  );
};

export default TotalContainer;
