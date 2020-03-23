import React from 'react';
import styles from './EquipmentGrid.module.css';
import Item from 'types/Item';

interface EquipmentGridProps {
  items: Array<Item>;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ items }) => {
  return (
    <div className={styles.equipmentGrid}>
      {items.map((item) => (
        <div className={styles.equipment} key={item.name}>
          <div>
            <img
              src={item.image || 'https://via.placeholder.com/150'}
              alt="TODO: support alt text"
            />
          </div>
          <div>{item.name}</div>
        </div>
      ))}
    </div>
  );
};

export default EquipmentGrid;
