import React, { useState } from 'react';

const Hello: React.FC = () => {
  const [counter, setCounter] = useState(0); // initialize the count to 0
  return (
    <div>
      <p>Hello, world! The counter was clicked {counter} times. </p>
      <button onClick={() => setCounter(counter + 1)}>Click me</button>
    </div>
  );
};

export default Hello;
