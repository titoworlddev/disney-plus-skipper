interface GetMessageTypeProps {
  active: boolean;
  introCheckbox: boolean;
  resumeCheckbox: boolean;
  jumpCheckbox: boolean;
}

export const getMessageType = ({
  active,
  introCheckbox,
  resumeCheckbox,
  jumpCheckbox
}: GetMessageTypeProps) => {
  if (!active) {
    return 'stop';
  } else if (!introCheckbox && !resumeCheckbox && !jumpCheckbox) {
    return 'stopIRJ';
  } else if (!introCheckbox && resumeCheckbox && jumpCheckbox) {
    return 'startRJ';
  } else if (introCheckbox && !resumeCheckbox && jumpCheckbox) {
    return 'startIJ';
  } else if (introCheckbox && resumeCheckbox && !jumpCheckbox) {
    return 'startIR';
  } else if (introCheckbox && !resumeCheckbox && !jumpCheckbox) {
    return 'startI';
  } else if (!introCheckbox && resumeCheckbox && !jumpCheckbox) {
    return 'startR';
  } else if (!introCheckbox && !resumeCheckbox && jumpCheckbox) {
    return 'startJ';
  } else {
    return 'start';
  }
};
