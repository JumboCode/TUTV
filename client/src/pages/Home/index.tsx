import React from 'react';
import { useApiData } from 'api';

const Home: React.FC = () => {
  const { data } = useApiData('users');

  return (
    <div>
      <h1>Home page</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export default Home;
