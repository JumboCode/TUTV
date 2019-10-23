import React from 'react';
// import './Button.css';

const Button: React.FC = () => {
  return (
    <div className="submit-button">
      <button
        type="submit"
        className="button-primary"
        // onClick={()}
      >
        Submit
      </button>
    </div>
  );
};

export default Button;
