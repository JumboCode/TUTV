import React from 'react';
import styles from './Dashboard.module.css';
import Icon from './Icon';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <Icon />
    </div>
  );
};

export default Dashboard;
