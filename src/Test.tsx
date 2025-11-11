import { useState } from 'react';

function Test() {
  const obj = { a: 1, b: 2, c: 3 };
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <p>{JSON.stringify(obj)}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Test;
