import React from 'react';

type CheckBoxProps = {
  checked: boolean;
  label: string;
  handleClick: () => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ checked, label, handleClick }) => {
  return (
    <div>
      <input
        className={
          checked ? 'Checkbox-container checked' : 'Checkbox-container'
        }
        onClick={handleClick}
        role="button"
        type="checkbox"
        tabIndex={0}
        data-label={label}
        //checked={this.state.checked}
      />
      <p className="label" data-label={label}>
        Label Name
      </p>
    </div>
  );
};

export default CheckBox;
