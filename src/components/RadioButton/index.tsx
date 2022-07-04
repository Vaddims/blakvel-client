import { MouseEvent } from "react";
import { RadioButtonOptions } from "./radio-button-options.interface";
import "./radio-button.scss";

export interface RadioButtonProps<Payload> {
  onClick?: (event: MouseEvent<HTMLButtonElement>, payload?: Payload) => void;
  options: RadioButtonOptions<Payload>;
  isSelected?: boolean;
}

const RadioButton = function<Payload>(props: RadioButtonProps<Payload>) {
  const { options, isSelected, onClick } = props;
  const { title, payload } = options;

  const onRadioButtonClick: typeof onClick = (event) => {
    if (!options.disabled) {
      onClick?.(event, payload);
    }
  }

  return (
    <button
      className={`radio-button ${isSelected ? 'select' : ''}`}
      disabled={options.disabled}
      onClick={onRadioButtonClick}  
    >
      <span className="radio-selector-title">{title}</span>
    </button>
  )
}

export default RadioButton;