import { ChangeEventHandler, useState } from 'react';
import './App.css';
import { sendMessageToContentScript } from './utils/sendMessageToContentScript';
import Checkbox from './components/Checkbox';
import styled from 'styled-components';
import Switch from './components/Switch';
import { useForm } from './hooks/useForm';
import { getMessageType } from './utils/getMessageType';

const initialForm = {
  introCheckbox: true,
  resumeCheckbox: true,
  jumpCheckbox: true
};
export default function App() {
  const { formState, onInputChange } = useForm(initialForm);
  const { introCheckbox, resumeCheckbox, jumpCheckbox } = formState;
  const [skipperSwitchChecked, setSkipperSwitchChecked] = useState(
    JSON.parse(localStorage.getItem('disneySkipperIsActive') ?? 'true')
  );

  const handleSendMessageToContentScript = (isCkeched: boolean) => {
    if (isCkeched) {
      sendMessageToContentScript(
        getMessageType({ introCheckbox, resumeCheckbox, jumpCheckbox })
      );
    } else {
      sendMessageToContentScript('stop');
    }
  };

  const handleSkipperSwitchChecked: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    localStorage.setItem(
      'disneySkipperIsActive',
      JSON.stringify(e.target.checked)
    );
    setSkipperSwitchChecked(e.target.checked);
    handleSendMessageToContentScript(e.target.checked);
  };

  const handleSkipperModes = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e);
    sendMessageToContentScript(
      getMessageType({ introCheckbox, resumeCheckbox, jumpCheckbox })
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
          onChange={handleSkipperModes}
        />
        <Checkbox
          labelText="Skip resume"
          name="resumeCheckbox"
          disabled={!skipperSwitchChecked}
          checked={resumeCheckbox}
          onChange={handleSkipperModes}
        />
        <Checkbox
          labelText="Jump to next episode"
          name="jumpCheckbox"
          disabled={!skipperSwitchChecked}
          checked={jumpCheckbox}
          onChange={handleSkipperModes}
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
