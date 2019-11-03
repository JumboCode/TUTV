import React from 'react';
import styles from './MainContent.module.css';
import Dashboard from './Dashboard';

const MainContent: React.FC = () => {
  return (
    <div className={styles.mainContent}>
      <Dashboard />
    </div>
  );
};

export default MainContent;
