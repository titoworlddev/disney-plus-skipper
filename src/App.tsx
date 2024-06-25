import { useState } from 'react';
import './App.css';

function App() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="pop-up">
      <h2>Disney+ Skipper</h2>

      <br />

      <label className="checkbox">
        Activate
        <input
          id="skipper-checkbox"
          type="checkbox"
          name="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <div className="checkmark"></div>
      </label>
    </div>
  );
}

export default App;
