import React from 'react';
import styles from './MemberDashboard.module.css';

const MemberDashboard: React.FC = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.header}>
        <h1>Welcome to TUTV's equipment checkout!</h1>
        <button className={styles.newreqbutton}>New Request</button>
      </div>

      <div className={styles.requestbox}>
        <h2 className={styles.requestheader}>My current requests</h2>
        <div className={styles.menubar}>
          <p className={styles.menuitem}> Project Name </p>
          <p className={styles.menuitem}> Checkout Time </p>
          <p className={styles.menuitem}>Return Time </p>
          <p className={styles.menuitem}> Status </p>
        </div>

        <div>
          <div className={styles.projectreq}>
            <h3>Request for Current Project 1</h3>
            <button className={styles.viewbutton}> View</button>
          </div>
          <div className={styles.projectreq}>
            <h3>Request for Current Project 2</h3>
            <button className={styles.viewbutton}> View</button>
          </div>
        </div>
      </div>

      <div className={styles.requestbox}>
        <h2 className={styles.requestheader}>My past requests</h2>

        <div className={styles.menubar}>
          <p className={styles.menuitem}> Project Name </p>
          <p className={styles.menuitem}> Checkout Time </p>
          <p className={styles.menuitem}>Return Time </p>
          <p className={styles.menuitem}> Status </p>
        </div>

        <div>
          <div className={styles.projectreq}>
            <h3>Request for Past Project 1</h3>
            <button className={styles.viewbutton}> View</button>
          </div>
          <div className={styles.projectreq}>
            <h3>Request for Past Project 2</h3>
            <button className={styles.viewbutton}> View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
