import React from 'react';
import { useState } from 'react';
const Hello: React.FC = () => {
  const [counter, setCount] = useState(0);
  return (
    <div>
      <p> Hello, world!</p>
      <div>
        <p> The counter was clicked {counter} times </p>
        <button onClick={() => setCount(counter + 1)}>Click me</button>
      </div>
    </div>
  );
};

export default Hello;
