import { ChangeEventHandler, useState } from 'react';
import './App.css';
import { sendMessageToContentScript } from './utils/sendMessageToContentScript';
import Checkbox from './components/Checkbox';
import styled from 'styled-components';
import Switch from './components/Switch';
import { useForm } from './hooks/useForm';

const initialForm = {
  introCheckbox: false,
  resumeCheckbox: false,
  jumpCheckbox: false
};
export default function App() {
  const { formState, onInputChange } = useForm(initialForm);
  const { introCheckbox, resumeCheckbox, jumpCheckbox } = formState;
  const [skipperSwitchChecked, setSkipperSwitchChecked] = useState(
    JSON.parse(localStorage.getItem('disneyPlusSkipperIsActive') || 'true')
  );

  const handleSkipperSwitchChecked: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    setSkipperSwitchChecked(e.target.checked);
    if (e.target.checked) {
      if (!introCheckbox && !resumeCheckbox && !jumpCheckbox) {
        sendMessageToContentScript('stop');
      } else if (!introCheckbox && resumeCheckbox && jumpCheckbox) {
        sendMessageToContentScript('startRJ');
      } else if (introCheckbox && !resumeCheckbox && jumpCheckbox) {
        sendMessageToContentScript('startIJ');
      } else if (introCheckbox && resumeCheckbox && !jumpCheckbox) {
        sendMessageToContentScript('startIR');
      } else if (introCheckbox && !resumeCheckbox && !jumpCheckbox) {
        sendMessageToContentScript('startI');
      } else if (!introCheckbox && resumeCheckbox && !jumpCheckbox) {
        sendMessageToContentScript('startR');
      } else if (!introCheckbox && !resumeCheckbox && jumpCheckbox) {
        sendMessageToContentScript('startJ');
      } else {
        sendMessageToContentScript('start');
      }
    } else {
      sendMessageToContentScript('stop');
    }
    localStorage.setItem(
      'disneyPlusSkipperIsActive',
      JSON.stringify(e.target.checked)
    );
  };

  return (
    <PopUp className="pop-up">
      <h2>Disney+ Skipper</h2>

      <hr />

      <Switch
        labelText="Activated"
        id="skipperSwitch"
        checked={skipperSwitchChecked}
        onChange={handleSkipperSwitchChecked}
      />
      <ul className="checkbox-list">
        <Checkbox
          labelText="Skip intro"
          name="introCheckbox"
          disabled={!skipperSwitchChecked}
          checked={introCheckbox}
          onChange={onInputChange}
        />
        <Checkbox
          labelText="Skip resume"
          name="resumeCheckbox"
          disabled={!skipperSwitchChecked}
          checked={resumeCheckbox}
          onChange={onInputChange}
        />
        <Checkbox
          labelText="Jump to next episode"
          name="jumpCheckbox"
          disabled={!skipperSwitchChecked}
          checked={jumpCheckbox}
          onChange={onInputChange}
        />
      </ul>
    </PopUp>
  );
}

const PopUp = styled.div`
  background: rgb(6, 6, 39);
  background: linear-gradient(
    180deg,
    rgba(6, 6, 39, 1) 0%,
    rgba(11, 35, 90, 1) 50%,
    rgba(16, 55, 128, 1) 100%
  );
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  width: 248px;

  .checkbox-list {
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 92.5%;
  }
`;
