import { MouseEventHandler } from "react";
import "./radio-button.scss";

export interface RadioButtonOption {
  title?: string;
  selectable?: boolean;
  defaultSelection?: boolean;
}

export interface RadioButtonProps {
  option: RadioButtonOption;
  select?: boolean;

  onClick?: MouseEventHandler<HTMLDivElement>;
}

function RadioButton(props: RadioButtonProps) {
  const { option, select, onClick } = props;

  return (
    <div className={`radio-button radio-selectable ${select ? 'select' : ''}`} onClick={onClick}>
      <label className="radio-selector-title">{option.title}</label>
    </div>
  );
}

export default RadioButton;