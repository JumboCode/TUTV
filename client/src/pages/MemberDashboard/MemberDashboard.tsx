import React from 'react';
import styles from './MemberDashboard.module.css';
import Button from 'components/Button';

const MemberDashboard: React.FC = () => {
  return (
    <div className={styles.backdrop}>
      <div className={styles.header}>
        <div>TUTV Equipment Checkout</div>
        <Button>New Request</Button>
      </div>
      <div>
        <div className={styles.requestheader}>
          <div>My current requests</div>
          <input type="string" placeholder="Search" />
        </div>
        <hr />
        <table className={styles.tableClass}>
          <tbody>
            <tr>
              <th>Project Name</th>
              <th>Checkout Time</th>
              <th>Return Time</th>
              <th>Status</th>
            </tr>
            <tr className={styles.projectreq}>
              <td className={styles.cellName}>Fake Current Project Name 1</td>
              <td className={styles.cellTime}>02/23/20 5:00pm</td>
              <td className={styles.cellTime}>03/23/20 5:00pm</td>
              <td className={styles.cellPend}>Pending</td>
              <td>
                <Button variant="gray" compact>
                  View
                </Button>
              </td>
              <td>
                <Button variant="gray" compact>
                  Edit
                </Button>
              </td>
            </tr>
            <tr className={styles.projectreq}>
              <td className={styles.cellName}>Fake Current Project Name 2</td>
              <td className={styles.cellTime}>02/24/20 3:00pm</td>
              <td className={styles.cellTime}>03/24/20 4:00pm</td>
              <td className={styles.cellApp}>Approved</td>
              <td>
                <Button variant="gray" compact>
                  View
                </Button>
              </td>
              <td>
                <Button variant="gray" compact>
                  Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div className={styles.requestheader}>My past requests</div>
        <hr />
        <table className={styles.tableClass}>
          <tbody>
            <tr>
              <th>Project Name</th>
              <th>Checkout Time</th>
              <th>Return Time</th>
              <th>Status</th>
            </tr>
            <tr className={styles.projectreq}>
              <td className={styles.cellName}>Fake Past Project Name 1</td>
              <td className={styles.cellTime}>02/20/20 12:00pm</td>
              <td className={styles.cellTime}>03/20/20 1:00pm</td>
              <td className={styles.cellRet}>Returned</td>
              <td>
                <Button variant="gray" compact>
                  View
                </Button>
              </td>
              <td>
                <Button variant="gray" compact>
                  Edit
                </Button>
              </td>
            </tr>
            <tr className={styles.projectreq}>
              <td className={styles.cellName}>Fake Past Project Name 2</td>
              <td className={styles.cellTime}>01/19/20 3:00pm</td>
              <td className={styles.cellTime}>02/15/20 4:00pm</td>
              <td className={styles.cellRet}>Returned</td>
              <td>
                <Button variant="gray" compact>
                  View
                </Button>
              </td>
              <td>
                <Button variant="gray" compact>
                  Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberDashboard;
