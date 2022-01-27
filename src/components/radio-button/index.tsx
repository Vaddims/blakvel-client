import { MouseEventHandler } from "react";
import "./radio-button.scss";

export interface RadioButtonOptions {
  title?: string;
  selectable?: boolean;
  defaultSelection?: boolean;
}

export interface RadioButtonProps {
  option: RadioButtonOptions;
  select?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

function RadioButton(props: RadioButtonProps) {
  const { option, select, onClick } = props;
  const onClickFunction = onClick ?? (_ => void 0);

  return (
    <div className={`radio-button radio-selectable ${select ? 'select' : ''}`} onClick={onClickFunction}>
      <label className="radio-selector-title">{option.title}</label>
    </div>
  );
}

export default RadioButton;