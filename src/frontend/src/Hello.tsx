import React, { useState } from 'react'; // import useState Hook from React

const Hello: React.FC = () => {
  // can use hooks here.. "hook into" React features
  // useState is a Hook that lets you add React state to function components

  // Declare a new state variable, which we'll call "counter", and set it to 0. This will hold the number of button clicks. setCounter is a function that lets us update the counter
  const [counter, setCounter] = useState(0);

  return (
    //when the user clicks, we call setCounter with a value incremented by 1.
    <div>
      <p>Hello, world!!!!!!</p>
      <p>You clicked {counter} times</p>

      <button onClick={() => setCounter(counter + 1)}>Click me</button>
    </div>
  );
};

export default Hello;
