import React from 'react';
import styles from './EquipmentBrowser.module.css';

const EquipmentBrowser: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.timepicker}>
        <div>
          <div>Checkout Time</div>
          <input type="datetime-local" />
        </div>
        <div>
          <div>Return Time</div>
          <input type="datetime-local" />
        </div>
      </div>
      <div>
        <button>Cancel Request</button>
        <button>Continue</button>
      </div>
    </div>
  );
};

export default EquipmentBrowser;
