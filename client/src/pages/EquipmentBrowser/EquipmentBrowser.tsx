import React from 'react';
import Modal from '../../components/ModalDialog';

import styles from './EquipmentBrowser.module.css';
import Collabspible from 'react-collapsible';

import Item from 'types/Item';

import EquipmentGrid from 'components/EquipmentGrid';
import CheckoutTimePicker from 'components/CheckoutTimePicker';

const EquipmentBrowser: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([]);
  React.useEffect(() => {
    fetch('https://tutv-mock.now.sh/api/v1/equipment/')
      .then(response => response.json())
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modal2IsOpen, set2IsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function openModal2() {
    set2IsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function closeModal2() {
    set2IsOpen(false);
  }

  const [checkoutTime, setCheckoutTime] = React.useState(new Date());
  const [returnTime, setReturnTime] = React.useState(new Date());

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.timepicker}>
          <div>
            <div>Checkout Time</div>
            <span className={styles.timebutton} onClick={openModal}>
              {checkoutTime.toLocaleString()}
            </span>
            <Modal
              className={styles.equipmentModal}
              displayed={modalIsOpen}
              onClose={closeModal}
            >
              <div>
                <h1>Select Checkout Time</h1>
                <CheckoutTimePicker onSelect={setCheckoutTime} />
              </div>
            </Modal>
          </div>
          <div>
            <div>
              <div>Return Time</div>
              <span className={styles.timebutton} onClick={openModal2}>
                {returnTime.toLocaleString()}
              </span>
              <Modal
                className={styles.equipmentModal}
                displayed={modal2IsOpen}
                onClose={closeModal2}
              >
                <div>
                  <h1>Select Return Time</h1>
                  <CheckoutTimePicker onSelect={setReturnTime} />
                </div>
              </Modal>
            </div>
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
