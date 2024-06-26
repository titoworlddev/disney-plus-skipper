import styled from 'styled-components';

interface Props {
  labelText: string;
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
  labelText,
  id,
  name,
  checked,
  onChange
}: Props) {
  return (
    <Label className="checkbox">
      {labelText}
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <div className="checkmark"></div>
    </Label>
  );
}

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  font-size: 16px;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    font-size: 14px;
    position: relative;
    top: 0;
    left: 0;
    height: 1.3em;
    width: 1.3em;
    border-radius: 50%;
    background: #ffeded38;
    transition: all 0.2s ease;
    opacity: 0.4;

    &:after {
      content: '';
      position: absolute;
      display: none;
      left: 0.41em;
      top: 0.222em;
      width: 0.25em;
      height: 0.5em;
      border: solid rgb(255, 255, 255);
      border-width: 0 0.15em 0.15em 0;
      transform: rotate(45deg);
    }
  }

  & input:checked ~ .checkmark {
    background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
    opacity: 0.9;
    transition: all 0.2s ease;

    &:after {
      display: block;
    }
  }
`;
