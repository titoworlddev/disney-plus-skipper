import { useState } from 'react';

export default function App() {
  const [isSkipperActive, setIsSkipperActive] = useState(true);

  return (
    <div className="pop-up">
      <label>
        Skipper active
        <input
          type="checkbox"
          checked={isSkipperActive}
          onChange={() => setIsSkipperActive(!isSkipperActive)}
        />
      </label>
    </div>
  );
}
