import React from 'react';
import styles from './MemberDashboard.module.css';

const MemberDashboard: React.FC = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.header}>
        <h1>Welcome to TUTV's equipment checkout!</h1>
        <button className={styles.newreqbutton}>New Request</button>
      </div>

      <div>
        <h2 className={styles.requestheader}>My current requests</h2>
        <table className={styles.reqtable}>
          <tr>
            <th>Project Name</th>
            <th>Checkout Time</th>
            <th>Return Time</th>
            <th>Status</th>
          </tr>
          <tr className={styles.projectreq}>
            <td>Fake Project Name 1</td>
            <td>02/23/20 5:00pm</td>
            <td>03/23/20 5:00pm</td>
            <td>Pending</td>
            <td>
              <button className={styles.viewbutton}> View</button>
            </td>
            <td>
              <button className={styles.editbutton}> Edit</button>
            </td>
          </tr>
          <tr>
            <th>Project Name</th>
            <th>Checkout Time</th>
            <th>Return Time</th>
            <th>Status</th>
          </tr>
          <tr className={styles.projectreq}>
            <td>Fake Project Name 2</td>
            <td>02/24/20 3:00pm</td>
            <td>03/24/20 4:00pm</td>
            <td>Approved</td>
            <td>
              <button className={styles.viewbutton}> View</button>
            </td>
            <td>
              <button className={styles.editbutton}> Edit</button>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <h2 className={styles.requestheader}>My past requests</h2>
        <table className={styles.reqtable}>
          <tr>
            <th>Project Name</th>
            <th>Checkout Time</th>
            <th>Return Time</th>
            <th>Status</th>
          </tr>
          <tr className={styles.projectreq}>
            <td>Fake Past Project Name 1</td>
            <td>02/20/20 12:00pm</td>
            <td>03/20/20 1:00pm</td>
            <td>Pending</td>
            <td>
              <button className={styles.viewbutton}> View</button>
            </td>
            <td>
              <button className={styles.editbutton}> Edit</button>
            </td>
          </tr>
          <tr>
            <th>Project Name</th>
            <th>Checkout Time</th>
            <th>Return Time</th>
            <th>Status</th>
          </tr>
          <tr className={styles.projectreq}>
            <td>Fake past Project Name 2</td>
            <td>01/19/20 3:00pm</td>
            <td>02/15/20 4:00pm</td>
            <td>Approved</td>
            <td>
              <button className={styles.viewbutton}> View</button>
            </td>
            <td>
              <button className={styles.editbutton}> Edit</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default MemberDashboard;
