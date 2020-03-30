import React from 'react';
import styles from './CheckoutTimePicker.module.css';

interface CheckoutTimePickerProps {
  //   items: Array<Item>;
}

const CheckoutTimePicker: React.FC<CheckoutTimePickerProps> = ({}) => {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

  return (
    <div className={styles.container}>
      {days.map(day => {
        return <div className={styles.columnn}>{day}</div>;
      })}
    </div>
  );
};

export default CheckoutTimePicker;
