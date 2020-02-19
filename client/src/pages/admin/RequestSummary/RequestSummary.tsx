import React from 'react';
import styles from './RequestSummary.module.css';

import Button from 'components/Button';

const RequestSummary: React.FC = () => {
  return (
    <div>
      <div className={styles.topItems}>
        <Button>Back</Button>
      </div>
    </div>
  );
};

export default RequestSummary;
