import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import ItemDetails from './ItemDetails';

const Catalog: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div>
      <h1>Catalog page</h1>
      <Switch>
        <Route path={`${(match || { path: '/' }).path}/:itemId`}>
          <ItemDetails />
        </Route>
        <Route path={(match || { path: '/' }).path}>No item selected</Route>
      </Switch>
    </div>
  );
};

export default Catalog;
