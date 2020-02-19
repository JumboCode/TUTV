import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styles from './EquipmentBrowser.module.css';
import Item from 'types/Item';

const EquipmentBrowser: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);
  const listItems = items.map(item => (
    <div className={styles.equipment} key={item.name}>
      <div>
        <img src="https://via.placeholder.com/150" />
      </div>
      <div>{item.name}</div>
    </div>
  ));
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
                <div className={styles.equipmentContainer}>{listItems}</div>
              </TabPanel>
              <TabPanel>
                <div className={styles.equipmentContainer}>{listItems}</div>
              </TabPanel>
              <TabPanel>
                <div className={styles.equipmentContainer}>{listItems}</div>
              </TabPanel>
              <TabPanel>
                <div className={styles.equipmentContainer}>{listItems}</div>
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
