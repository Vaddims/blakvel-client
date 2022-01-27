import { ReactElement, useState } from 'react';
import RadioButton, { RadioButtonOptions, RadioButtonProps } from '../radio-button';
import "./radio-selector.scss";

interface RadioSelectorProps {
  title: string;
  multiple?: boolean;
  collapse?: boolean;
  collapsible?: boolean;
  options: RadioButtonOptions[];
}

interface RadioSelectorState {
  collapse: boolean;
  selectedOptions: RadioButtonOptions[];
}

function RadioSelector(props: RadioSelectorProps) {
  const { title, collapse, multiple, options } = props;

  const accumulator = (option: RadioButtonOptions) => option.defaultSelection;
  const [state, setState] = useState<RadioSelectorState>({
    collapse: collapse ?? false,
    selectedOptions: multiple ? options.filter(accumulator) : (() => { 
      const s = options.find(accumulator);
      return s ? [s] : [];
    })(),
  });
  
  const toggleCollapse = () => setState({ ...state, collapse: !state.collapse });
  const optionSelected = (targetOption: RadioButtonOptions) => !!state.selectedOptions.find(option => option === targetOption);
  const selectOption = (option: RadioButtonOptions) => {
    const selectedOptions = [...state.selectedOptions];
    selectedOptions.push(option);
    setState({ ...state, selectedOptions });
  }

  const unselectOption = (targetOption: RadioButtonOptions) => {
    const selectedOptions = state.selectedOptions.filter(option => option !== targetOption);
    setState({ ...state, selectedOptions });
  }

  const toggleOption = (option: RadioButtonOptions) => () => {
    if (multiple) {
      if (!optionSelected(option)) {
        if (!multiple && state.selectedOptions.length != 0) {
          return;
        }
  
        selectOption(option);
      } else {
        unselectOption(option)
      }
    } else {
      if (!optionSelected(option)) {
        setState({ ...state, selectedOptions: [option] });
      }
    }
  }

  return (
    <div className="radio-selector">
      <div className="radio-selector-header radio-selectable" onClick={toggleCollapse}>
        <label className="radio-selector-title">{title}</label>
        <i className="fas fa-chevron-down"></i>
      </div>
      <div className="radio-selections">
        {!state.collapse && options.map((option, index) => 
          <RadioButton option={option} select={optionSelected(option)} onClick={toggleOption(options[index])} />
        )}
      </div>
    </div>
  );
}

export default RadioSelector;