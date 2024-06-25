import { useEffect, useState } from 'react';
import './App.css';
import { sendMessageToContentScript } from './utils/sendMessageToContentScript';

function App() {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    chrome.storage.local.get('skipperIsActive', ({ skipperIsActive }) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting search state:', chrome.runtime.lastError);
      } else {
        setChecked(skipperIsActive || true);
      }
    });
  }, []);

  useEffect(() => {
    if (checked) {
      sendMessageToContentScript('start');
    } else {
      sendMessageToContentScript('stop');
    }
  }, [checked]);

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
          onChange={() => setChecked(!checked)}
        />
        <div className="checkmark"></div>
      </label>
    </div>
  );
}

export default App;
