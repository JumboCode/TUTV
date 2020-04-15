import React, { ReactElement } from 'react';
import { useStore } from 'store';

export function useLoginState() {
  const { state } = useStore();
  return state.auth.accessToken && state.auth.refreshToken;
}

interface LoginShieldProps {
  fallback: ReactElement;
}

const LoginShield: React.FC<LoginShieldProps> = ({ children, fallback }) => {
  const isLoggedIn = useLoginState();
  return isLoggedIn ? (children as ReactElement) : fallback;
};

export default LoginShield;
