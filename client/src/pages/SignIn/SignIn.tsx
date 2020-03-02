import React from 'react';
import styles from './SignIn.module.css';
import logo from './TUTVLogo.png';
import button from '../../components/Button';

const SignIn: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const attemptSignIn = () => {
    console.log('Username:', username, 'Password:', password);
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
          onChange={e => setUsername(e.target.value)}
        />
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          className={styles.input}
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className={styles.forgotPass}>{'Forgot Password?'}</div>
        <button
          className={styles.signInButton}
          type="submit"
          onClick={e => attemptSignIn()}
        >
          Sign In
        </button>
        <div className={styles.email}>
          {"Don't have an account? Email TUTV.studios@gmail.com"}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
