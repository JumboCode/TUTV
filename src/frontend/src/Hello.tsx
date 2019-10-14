import React from 'react';
import { useState } from 'react';

const Hello: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
  	<div>
  		<p>Drybell</p>
  		<p>The counter was clicked {count} times</p>
  		<button onClick={() => setCount(count + 1)}>
  			CLICK HERE!!! 
  		</button>
  	</div>
  )
};

export default Hello;
