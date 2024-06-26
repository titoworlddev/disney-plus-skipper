import { ChangeEventHandler, useState } from 'react';
import './App.css';
import { sendMessageToContentScript } from './utils/sendMessageToContentScript';

function App() {
  const [checked, setChecked] = useState(
    JSON.parse(localStorage.getItem('disneyPlusSkipperIsActive') || 'true')
  );

  const handleChecked: ChangeEventHandler<HTMLInputElement> = e => {
    console.log(e.target.checked);
    setChecked(e.target.checked);
    if (e.target.checked) {
      sendMessageToContentScript('start');
    } else {
      sendMessageToContentScript('stop');
    }
    localStorage.setItem(
      'disneyPlusSkipperIsActive',
      JSON.stringify(e.target.checked)
    );
  };

  return (
    <div className="pop-up">
      <h2>Disney+ Skipper</h2>

      <br />

      <label className="checkbox">
        Activated
        <input
          id="skipper-checkbox"
          type="checkbox"
          name="checkbox"
          checked={checked}
          onChange={handleChecked}
        />
        <div className="checkmark"></div>
      </label>
    </div>
  );
}

export default App;
