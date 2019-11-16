import React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Button from '../../components/Button';
import Header from '../../components/Header';

const EquipmentBrowser: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div>
      <h1>Equipment Browser page</h1>
      <Header />
      <Button />
      <Button />
    </div>
  );
};

export default EquipmentBrowser;
