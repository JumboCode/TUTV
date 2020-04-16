import React from 'react';
import styles from './EquipmentBrowser.module.css';
import Collabspible from 'react-collapsible';
import Button from 'components/Button';

import Item from 'types/Item';

import EquipmentGrid from 'components/EquipmentGrid';

const EquipmentBrowser: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);
  React.useEffect(() => {
    fetch('https://tutv-mock.now.sh/api/v1/equipment/')
      .then((response) => response.json())
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <table className={styles.tableClass}>
          <tbody>
            <tr>
              <th>Project Name</th>
              <th>Checkout Time</th>
              <th>Return Time</th>
            </tr>
            <tr className={styles.projectreq}>
              <td className={styles.cellName}>Fake Project Name</td>
              <td>
                <input type="datetime-local" />
              </td>
              <td>
                <input type="datetime-local" />
              </td>
            </tr>
          </tbody>
        </table>
        <Button variant="gray" className={styles.headerButton}>
          Cancel Request
        </Button>
        <Button className={styles.headerButton}>Continue</Button>
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
          <div className={styles.cart}>
            <div>
              <div>Equipment Cart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentBrowser;
