import React from 'react';
import Calendar from './Calendar';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <Calendar />
    </div>
  );
};

export default Sidebar;
