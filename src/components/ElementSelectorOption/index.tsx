import { MouseEvent } from "react";
import ElementSelectorOptions from "./element-selector-options.interface";
import "./element-selector-option.scss";

export interface ElementSelectorOptionProps<T> {
  onClick?: (event: MouseEvent<HTMLButtonElement>, payload?: T) => void;
  options: ElementSelectorOptions<T>;
  isSelected?: boolean;
}

const RadioButton: React.FC<ElementSelectorOptionProps<any>> = function<T>(props: ElementSelectorOptionProps<T>) {
  const { options, isSelected, onClick } = props;
  const { title, payload } = options;

  const onOptionClick: typeof onClick = (event) => {
    if (!options.disabled) {
      onClick?.(event, payload);
    }
  }

  return (
    <button
      className='element-selector-option'
      aria-selected={isSelected}
      disabled={options.disabled}
      onClick={onOptionClick}  
    >
      <span className="element-selector-title">{title}</span>
    </button>
  )
}

export default RadioButton;