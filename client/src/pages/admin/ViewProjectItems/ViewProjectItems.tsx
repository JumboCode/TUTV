import React from 'react';
import styles from './ViewProjectItems.module.css';
import Item from 'types/Item';
import Collabspible from 'react-collapsible';
import Button from 'components/Button';
import { ChevronDown } from 'react-feather';
import EquipmentGrid from 'components/EquipmentGrid';

const ViewProjectItems: React.FC = () => {
  return (
    <div>
      <div className={styles.header}>
        <div>Lover's Quarrel</div>
        <div>
          <Button variant="gray" className={styles.headerButton}>
            Cancel Request
          </Button>
          <Button className={styles.headerButton}>Start Checkout</Button>
        </div>
      </div>
      <div>
        <div className={styles.viewItemsPage}>
          <div className={styles.reqItems}></div>
          <div className={styles.checkedItems}>
            <div>
              <div>Checked out items will appear here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectItems;
