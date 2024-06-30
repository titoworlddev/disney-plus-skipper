import styled from 'styled-components';

interface Props {
  labelText: string;
  id: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Switch({ labelText, id, checked, onChange }: Props) {
  return (
    <Label className="switch">
      <h2>{labelText}</h2>
      <div className="checkbox">
        <input
          id={id}
          type="checkbox"
          name={id}
          checked={checked}
          onChange={onChange}
        />
        <label className="toggle" htmlFor={id}>
          <span></span>
        </label>
      </div>
    </Label>
  );
}

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  h2 {
    font-size: 18px;
  }

  .checkbox input[type='checkbox'] {
    visibility: hidden;
    display: none;
  }

  .checkbox .toggle {
    position: relative;
    display: block;
    width: 40px;
    height: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);
  }
  .checkbox .toggle:before {
    content: '';
    position: relative;
    top: 3px;
    left: 3px;
    width: 34px;
    height: 14px;
    display: block;
    background: #c9c9c9;
    border-radius: 8px;
    transition: background 0.2s ease;
  }
  .checkbox .toggle span {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    display: block;
    background: white;
    border-radius: 10px;
    box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
    transition: all 0.2s ease;
  }
  .checkbox .toggle span:before {
    content: '';
    position: absolute;
    display: block;
    margin: -18px;
    width: 56px;
    height: 56px;
    background: rgba(154, 153, 153, 0.5);
    border-radius: 50%;
    transform: scale(0);
    opacity: 1;
    pointer-events: none;
  }

  .checkbox input[type='checkbox']:checked + .toggle:before {
    background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  }
  .checkbox input[type='checkbox']:checked + .toggle span {
    background: #fafafa;
    transform: translateX(20px);
    transition: all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25),
      background 0.15s ease;
    box-shadow: 0 3px 8px rgba(154, 153, 153, 0.2);
  }
  .checkbox input[type='checkbox']:checked + .toggle span:before {
    transform: scale(1);
    opacity: 0;
    transition: all 0.4s ease;
  }
`;
