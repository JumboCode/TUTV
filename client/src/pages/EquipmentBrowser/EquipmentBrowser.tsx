import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styles from './EquipmentBrowser.module.css';

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
          <div className={styles.equipmentGrid}>
            <Tabs>
              <TabList>
                <Tab>Camera</Tab>
                <Tab>Audio</Tab>
                <Tab>Lighting</Tab>
                <Tab>Misc</Tab>
              </TabList>

              <TabPanel>
                <EquipmentGrid items={items} />
              </TabPanel>
              <TabPanel>
                <EquipmentGrid items={items} />
              </TabPanel>
              <TabPanel>
                <EquipmentGrid items={items} />
              </TabPanel>
              <TabPanel>
                <EquipmentGrid items={items} />
              </TabPanel>
            </Tabs>
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
