import React, { useState } from 'react';

const Hello: React.FC = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>Hello, world!</p>
      <p>You clicked {counter} times</p>
      <button onClick={() => setCounter(counter + 1)}>Click me</button>
    </div>
  );
};
export default Hello;
