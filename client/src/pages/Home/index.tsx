import React from 'react';
import useApi from '../../api';

const Home: React.FC = () => {
  const { data } = useApi('users');

  return (
    <div>
      <h1>Home page</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export default Home;
