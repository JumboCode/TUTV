import React from 'react';
import styles from './AdminCheckout.module.css';
import EquipmentGrid from 'components/EquipmentGrid';
import Item from 'types/Item';

const AdminCheckout: React.FC = () => {
  const [items, setItems] = React.useState<Array<Item>>([
    {
      name: 'IDK',
      slug: 'idk',
      category: {
        name: 'camera',
        slug: 'camera',
        id: 0
      },
      total_count: 4,
      image: null
    }
  ]);

  return (
    <div>
      <h1>Title</h1>
      <div className={styles.grid}>
        <EquipmentGrid items={items} />
      </div>
    </div>
  );
};

export default AdminCheckout;
