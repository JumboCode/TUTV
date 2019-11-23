import React from 'react';
import './App.css';
// import Hello from './Hello';
import LoginContainer from './LoginContainer/LoginContainer';


const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <LoginContainer />
      </header>
    </div>
  );
};

export default App;
