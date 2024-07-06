import Checkbox from './components/Checkbox';
import styled from 'styled-components';
import Switch from './components/Switch';
import { useLanguage } from './hooks/useLanguage';
import { useForm } from './hooks/useForm';

export default function App() {
  const { language } = useLanguage();
  const {
    introCheckbox,
    resumeCheckbox,
    jumpCheckbox,
    skipperSwitchChecked,
    handleSkipperSwitchChecked,
    handleSkipperModes
  } = useForm();

  return (
    <PopUp className="pop-up">
      <h1>Disney+ AutoSkip</h1>

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
