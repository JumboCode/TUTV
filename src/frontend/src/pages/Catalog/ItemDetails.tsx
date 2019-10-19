import React from 'react';
import { useParams } from 'react-router-dom';

const ItemDetails: React.FC = () => {
  const { itemId } = useParams();
  return (
    <div>Viewing item <code>{itemId}</code></div>
  );
};

export default ItemDetails;
