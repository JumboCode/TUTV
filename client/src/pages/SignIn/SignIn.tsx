import React from 'react';
import styles from './SignIn.module.css';
import logo from './TUTVLogo.png';
import Button from 'components/Button';
import { useStore } from 'store';
import { useApiRequest } from 'api';

const SignIn: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { dispatch } = useStore();

  const getToken = useApiRequest('token', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  const doSignIn = (tokens: { refresh: string; access: string }) => {
    const { refresh, access } = tokens;
    dispatch({ type: 'login', tokens: { refresh, access } });
  };

  const attemptSignIn = () => {
    getToken()
      .then(doSignIn)
      .catch((e) => {
        alert(`Something went wrong: ${e.response && e.response.detail}`);
      });
  };

  return (
    <div className={styles.page}>
      <div className={styles.signIn}>
        <img className={styles.logo} src={logo} alt="TUTV logo" />
        <div className={styles.pageTitle}>{'MEMBER LOGIN'}</div>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          className={styles.input}
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.forgotPass}>{'Forgot Password?'}</div>
        <Button
          className={styles.signInButton}
          type="submit"
          pill
          onClick={(e) => attemptSignIn()}
        >
          Sign In
        </Button>
      </div>
      <div className={styles.email}>
        {"Don't have an account? Email TUTV.studios@gmail.com"}
      </div>
    </div>
  );
};

export default SignIn;
