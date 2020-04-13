import React, { useState } from 'react';
import styles from './CheckoutTimePicker.module.css';

interface CheckoutTimePickerProps {
  /* to pass info to parent */
  /* takes a function, child comp calls function w new data */
  /* when makes checkouttime picker, child comp calls function when select a new time */
  /* onselect function is provided by parent and called by the child */
  onSelect: (value: Date) => void;
}

function getDay() {
  const d = new Date();
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

const CheckoutTimePicker: React.FC<CheckoutTimePickerProps> = ({
  onSelect
}) => {
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
  function selectTime() {
    // TODO: create date object with correct date + time
    const selectedCheckoutDateTime = new Date();
    onSelect(selectedCheckoutDateTime);
  }

  const weekDates = new Array(7)
    .fill(null)
    .map((_, i) => firstDayDisplayed + 1000 * 60 * 60 * 24 * i)
    .map(timestamp => new Date(timestamp));

  return (
    <div className={styles.popup}>
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
              {/*  make radio buttons */}
              <div className={styles.timeslot}>Timeslot Box</div>
              {/* date + times  */}
            </div>
          );
        })}
      </div>
      <button className={styles.selectbutton}>Select</button>
    </div>
  );
};

export default CheckoutTimePicker;
