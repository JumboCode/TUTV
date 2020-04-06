import React, { useState } from 'react';
import styles from './CheckoutTimePicker.module.css';

interface CheckoutTimePickerProps {
  //   items: Array<Item>;
}

function getDay() {
  const d = new Date();
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

// getMonday(new Date()); /

const CheckoutTimePicker: React.FC<CheckoutTimePickerProps> = ({}) => {
  const date = new Date();
  const dayOfWeekNow = date.getDay(); // number of days since sunday
  date.setDate(date.getDate() - dayOfWeekNow);

  //     number             function
  const [firstDayDisplayed, setFirstDayDisplayed] = useState(date.getTime());

  function nextWeek() {
    setFirstDayDisplayed(firstDayDisplayed + 1000 * 60 * 60 * 24 * 7);
  }
  function prevWeek() {
    setFirstDayDisplayed(firstDayDisplayed - 1000 * 60 * 60 * 24 * 7);
  }

  const weekDates = new Array(7)
    .fill(null)
    .map((_, i) => firstDayDisplayed + 1000 * 60 * 60 * 24 * i)
    .map(timestamp => new Date(timestamp));

  return (
    <div className={styles.container}>
      {weekDates.map(date => {
        return (
          <div className={styles.column}>
            <div className={styles.weekday}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={styles.date}>
              {date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: '2-digit'
              })}
            </div>
            <div>box</div>
            {/* date + times  */}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutTimePicker;
