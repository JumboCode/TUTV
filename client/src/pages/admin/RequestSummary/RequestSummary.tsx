import React from 'react';
import styles from './RequestSummary.module.css';
import Item from 'types/Item';

import Button from 'components/Button';
import EquipmentGrid from 'components/EquipmentGrid';

const RequestSummary: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);

  // Fetch on component mount
  React.useEffect(() => {
    fetch('https://tutv-mock.now.sh/api/v1/equipment/')
      .then(response => response.json())
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  const checkoutTime = new Date('November 5, 2019 18:00');
  const returnTime = new Date('November 7, 2019 18:00');

  return (
    <div>
      <div className={styles.topItems}>
        <Button>Back</Button>
        <h1>Request Summary</h1>
      </div>
      <div className={styles.flexContainer}>
        <EquipmentGrid items={items} />
        <aside className={styles.panelRight}>
          <div>
            <div>Checkout Time:</div>
            <div>
              {checkoutTime.toLocaleDateString()}{' '}
              {checkoutTime.toLocaleTimeString()}
            </div>
          </div>
          <div>
            <div>Return Time:</div>
            <div>
              {returnTime.toLocaleDateString()}{' '}
              {returnTime.toLocaleTimeString()}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RequestSummary;
