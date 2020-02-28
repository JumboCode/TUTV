import React from 'react';
import 'react-tabs/style/react-tabs.css';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <div>
        <h1>Welcome Back, Admin</h1>
        <div className={styles.pageContainer}>
          <div className={styles.requestContainer}>
            <h2>Requests Timeline</h2>
          </div>
          <div className={styles.requestDetails}>
            <div className={styles.active}>
              <h2>Active Requests</h2>
              <div className={styles.requestHeader}>
                <div>Project Name</div>
                <div>Checkout Time</div>
                <div>Return Time</div>
                <div>Status</div>
              </div>
              <div className={styles.projectDetails}>
                <div>Project 1</div>
                <div>Checkout time</div>
                <div>Return time</div>
                <div>Approved</div>
                <button>View</button>
              </div>
              <div className={styles.projectDetails}>
                <div>Project 2</div>
                <div>Checkout time</div>
                <div>Return time</div>
                <div>Approved</div>
                <button>View</button>
              </div>
            </div>
            <div className={styles.past}>
              <h2>Past Requests</h2>
              <div className={styles.projectDetails}>
                <div>Project 3</div>
                <div>Checkout time</div>
                <div>Return time</div>
                <div>Returned</div>
                <button>View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
