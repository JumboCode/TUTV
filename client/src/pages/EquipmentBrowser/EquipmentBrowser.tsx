import React from 'react';
import styles from './EquipmentBrowser.module.css';
import Collabspible from 'react-collapsible';

import Item from 'types/Item';

import EquipmentGrid from 'components/EquipmentGrid';

const EquipmentBrowser: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);
  React.useEffect(() => {
    fetch('https://tutv-mock.now.sh/api/v1/equipment/')
      .then(response => response.json())
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
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
      <div>
        <div className={styles.equipmentPage}>
          <div className={styles.wrapper}>
            <Collabspible
              trigger="Camera &#9660;"
              triggerTagName="div"
              className={styles.collapsehead}
              openedClassName={styles.collapsehead}
            >
              <EquipmentGrid items={items} />
            </Collabspible>
            <Collabspible
              trigger="Audio &#9660;"
              triggerTagName="div"
              className={styles.collapsehead}
              openedClassName={styles.collapsehead}
            >
              <EquipmentGrid items={items} />
            </Collabspible>
            <Collabspible
              trigger="Lighting &#9660;"
              triggerTagName="div"
              className={styles.collapsehead}
              openedClassName={styles.collapsehead}
            >
              <EquipmentGrid items={items} />
            </Collabspible>
            <Collabspible
              trigger="Misc &#9660;"
              triggerTagName="div"
              className={styles.collapsehead}
              openedClassName={styles.collapsehead}
            >
              <EquipmentGrid items={items} />
            </Collabspible>
          </div>
          <div className={styles.selectedEquipment}>
            <div>
              <div>Selected Equipment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentBrowser;
