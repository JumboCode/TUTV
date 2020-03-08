import React from 'react';
import styles from './SignIn.module.css';

const SignIn: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const attemptSignIn = () => {
    console.log('Username:', username, 'Password:', password);
  };

  return (
    <div className={styles.signIn}>
      <img
        className={styles.logo}
        src="https://via.placeholder.com/200x200"
        alt="TUTV logo"
      />
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" onClick={e => attemptSignIn()}>
        Sign In
      </button>
    </div>
  );
};

export default SignIn;
