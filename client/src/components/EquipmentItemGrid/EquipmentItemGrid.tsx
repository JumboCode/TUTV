import React from 'react';
import styles from './EquipmentItemGrid.module.css';
import { EquipmentItem } from 'types/Equipment';

interface EquipmentItemGridProps {
  items: EquipmentItem[];
}

const EquipmentItemGrid: React.FC<EquipmentItemGridProps> = ({ items }) => {
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

export default EquipmentItemGrid;
