import React from 'react';
// import './Form.css';
import Button from './Button';

const Form: React.FC = () => {
  return (
    <div className="Form">
      <form className="Login">
        <div className="form-group">
          <p> Sign In </p>
          <div className="e-mail">
            <p className="info">E-Mail</p>
            <input type="text" name="e-mail" />
          </div>
          <div className="password">
            <p className="info">Password</p>
            <input type="password" name="pass" />
          </div>
          <Button />
        </div>
      </form>
    </div>
  );
};

export default Form;
