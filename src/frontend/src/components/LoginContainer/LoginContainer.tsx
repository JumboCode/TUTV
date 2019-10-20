import React, { useState } from "react";
import './LoginContainer.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Form from './Form/Form';
// import Button from "./Button/Button"

const LoginContainer: React.FC = () => {
  return (
    <div className="LoginContainer">
      <Header />
      <Form />
      <Footer />
    </div>
  );
};

export default LoginContainer;