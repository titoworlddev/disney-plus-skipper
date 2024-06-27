interface GetMessageTypeProps {
  introCheckbox: boolean;
  resumeCheckbox: boolean;
  jumpCheckbox: boolean;
}

export const getMessageType = ({
  introCheckbox,
  resumeCheckbox,
  jumpCheckbox
}: GetMessageTypeProps) => {
  if (!introCheckbox && !resumeCheckbox && !jumpCheckbox) {
    return 'stop';
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
