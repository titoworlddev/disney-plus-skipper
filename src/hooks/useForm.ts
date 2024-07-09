import { ChangeEventHandler, useEffect, useState } from 'react';
import { sendMessageToContentScript } from '../utils/sendMessageToContentScript';
import { getMessageType } from '../utils/getMessageType';
import { saveToLocalStorage } from '../utils/saveToLocalStorage';

const initialFormState = JSON.parse(
  localStorage.getItem('disneySkipperIsActive') ??
    JSON.stringify({
      active: true,
      introCheckbox: true,
      resumeCheckbox: true,
      jumpCheckbox: true
    })
);

export const useForm = () => {
  const [shouldExecuteEffect, setShouldExecuteEffect] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const { introCheckbox, resumeCheckbox, jumpCheckbox } = formState;
  const [skipperSwitchChecked, setSkipperSwitchChecked] = useState(
    initialFormState.active
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
    saveToLocalStorage({ ...formState, active: e.target.checked });
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

  return {
    // Propiedades
    introCheckbox,
    resumeCheckbox,
    jumpCheckbox,
    skipperSwitchChecked,

    // Metodos
    handleSkipperSwitchChecked,
    handleSkipperModes
  };
};
