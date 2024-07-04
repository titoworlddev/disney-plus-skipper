import { ChangeEventHandler, useEffect, useState } from 'react';
import { sendMessageToContentScript } from './utils/sendMessageToContentScript';
import Checkbox from './components/Checkbox';
import styled from 'styled-components';
import Switch from './components/Switch';
import { getMessageType } from './utils/getMessageType';
import { saveToLocalStorage } from './utils/saveToLocalStorage';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { language } = useLanguage();
  const [shouldExecuteEffect, setShouldExecuteEffect] = useState(false);
  const [formState, setFormState] = useState({
    introCheckbox:
      JSON.parse(localStorage.getItem('disneySkipperIsActive') ?? '{}')
        .introCheckbox ?? true,
    resumeCheckbox:
      JSON.parse(localStorage.getItem('disneySkipperIsActive') ?? '{}')
        .resumeCheckbox ?? true,
    jumpCheckbox:
      JSON.parse(localStorage.getItem('disneySkipperIsActive') ?? '{}')
        .jumpCheckbox ?? true
  });
  const { introCheckbox, resumeCheckbox, jumpCheckbox } = formState;
  const [skipperSwitchChecked, setSkipperSwitchChecked] = useState(
    JSON.parse(localStorage.getItem('disneySkipperIsActive') ?? '{}').active ??
      true
  );

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState({ ...formState, [name]: checked });
  };

  const handleSendMessageToContentScript = (isChecked: boolean) => {
    if (isChecked) {
      sendMessageToContentScript(
        getMessageType({ active: isChecked, ...formState })
      );
    } else {
      sendMessageToContentScript('stop');
    }
  };

  const handleSkipperSwitchChecked: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    saveToLocalStorage({ active: e.target.checked, ...formState });
    setSkipperSwitchChecked(e.target.checked);
    handleSendMessageToContentScript(e.target.checked);
  };

  const handleSkipperModes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    handleOnInputChange(e);
    const disneySkipperIsActive = JSON.parse(
      localStorage.getItem('disneySkipperIsActive') ??
        JSON.stringify({
          active: skipperSwitchChecked,
          ...formState
        })
    );
    saveToLocalStorage({ ...disneySkipperIsActive, [name]: checked });
  };

  useEffect(() => {
    setShouldExecuteEffect(true);
  }, []);
  useEffect(() => {
    if (!shouldExecuteEffect) {
      return;
    }
    sendMessageToContentScript(
      getMessageType({ active: skipperSwitchChecked, ...formState })
    );
  }, [formState]);

  return (
    <PopUp className="pop-up">
      <h1>Disney+ Skipper</h1>

      <hr />

      <div className="checkboxes">
        <Switch
          labelText={language.skipperSwitchLabel}
          id="skipperSwitch"
          checked={skipperSwitchChecked}
          onChange={handleSkipperSwitchChecked}
        />
        <ul className="checkbox-list">
          <Checkbox
            labelText={language.introCheckboxLabel}
            name="introCheckbox"
            disabled={!skipperSwitchChecked}
            checked={introCheckbox}
            onChange={handleSkipperModes}
          />
          <Checkbox
            labelText={language.resumeCheckboxLabel}
            name="resumeCheckbox"
            disabled={!skipperSwitchChecked}
            checked={resumeCheckbox}
            onChange={handleSkipperModes}
          />
          <Checkbox
            labelText={language.jumpCheckboxLabel}
            name="jumpCheckbox"
            disabled={!skipperSwitchChecked}
            checked={jumpCheckbox}
            onChange={handleSkipperModes}
          />
        </ul>
      </div>
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
  gap: 20px;
  padding: 16px;
  width: 296px;

  h1 {
    font-size: 26px;
  }

  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .checkbox-list {
      align-self: flex-end;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 92.5%;
    }
  }
`;
