import React from 'react';
import styles from './AdminDashboard.module.css';

export interface RequestInfo {
  name: string;
  checkoutTime: Date;
  returnTime: Date;
  status: 'pending' | 'approved' | 'checked out' | 'returned';
}

const AdminDashboard: React.FC = () => {
  const rowFromRequestInfo = ({
    name,
    checkoutTime,
    returnTime,
    status
  }: RequestInfo) => {
    return (
      <tr className={styles.projectDetails} key={name}>
        <td>{name}</td>
        <td>{checkoutTime.toDateString()}</td>
        <td>{returnTime.toDateString()}</td>
        <td>{status}</td>
        <td>
          <button>View</button>
        </td>
      </tr>
    );
  };

  const currentRequests: RequestInfo[] = [
    {
      name: 'O hey',
      checkoutTime: new Date(),
      returnTime: new Date(),
      status: 'pending'
    },
    {
      name: 'O hey',
      checkoutTime: new Date(),
      returnTime: new Date(),
      status: 'pending'
    }
  ];
  // All past requests will be returned requests
  const pastRequests: RequestInfo[] = [
    {
      name: 'O hey',
      checkoutTime: new Date(),
      returnTime: new Date(),
      status: 'returned'
    },
    {
      name: 'O hey 2',
      checkoutTime: new Date(),
      returnTime: new Date(),
      status: 'returned'
    },
    {
      name: 'O hey',
      checkoutTime: new Date(),
      returnTime: new Date(),
      status: 'returned'
    }
  ];

  return (
    <div>
      <h1>Welcome Back, Admin</h1>
      <div className={styles.pageContainer}>
        <h2>Active Requests</h2>
        <table>
          <tbody>
            <tr className={styles.requestHeader}>
              <th>Project Name</th>
              <th>Checkout Time</th>
              <th>Return Time</th>
              <th>Status</th>
              <th> </th>
            </tr>
            {currentRequests.map(rowFromRequestInfo)}
          </tbody>
        </table>
        <h2>My Past Requests</h2>
        <table>
          <tbody>
            <tr className={styles.requestHeader}>
              <th>Project Name</th>
              <th>Checkout Time</th>
              <th>Return Time</th>
              <th>Status</th>
              <th> </th>
            </tr>
            {pastRequests.map(rowFromRequestInfo)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
