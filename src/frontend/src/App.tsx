import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
<<<<<<< HEAD
import Welcome from './hello'
=======
import Hello from './hello';
>>>>>>> f497b23ef2ba800e2416de395640c3748395c7a2

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
<<<<<<< HEAD
        <Welcome />
=======
        <Hello>
        </Hello>
>>>>>>> f497b23ef2ba800e2416de395640c3748395c7a2
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
