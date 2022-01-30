import { useState } from 'react';
import RadioButton, { RadioButtonOption } from '../radio-button';
import "./radio-selector.scss";

interface RadioMultiSelectorProps {
  title: string;
  collapse?: boolean;
  collapsible?: boolean;
  target?: RadioButtonOption[] | RadioButtonOption | null;
  options: RadioButtonOption[];
  onTargetChange?: (targets: RadioButtonOption[]) => void;
}

interface RadioMultiSelectorState {
  targetOptions: RadioButtonOption[];
  collapse: boolean;
}

function RadioMultiSelector(props: RadioMultiSelectorProps) {
  const { title, collapse, options, onTargetChange, target } = props;

  const targets = target ? Array.isArray(target) ? target : [target] : [];
  const defaultTragets = options.filter(option => option.defaultSelection);

  const [state, setState] = useState<RadioMultiSelectorState>({
    targetOptions: typeof target === 'undefined' ? defaultTragets : targets,
    collapse: collapse ?? false,
  });

  const toggleCollapse = () => setState({ ...state, collapse: !state.collapse });
  const optionIsTarget = (option: RadioButtonOption) => 
    !!state.targetOptions.find(targetOptions => targetOptions === option);

  const toggleOption = (option: RadioButtonOption) => () => {
    const targetOptions = optionIsTarget(option) 
      ? state.targetOptions.filter(targetOption => targetOption !== option)
      : [...state.targetOptions, option];
    
    setState({ ...state, targetOptions });
    onTargetChange?.(targetOptions);
  }

  return (
    <div className="radio-selector">
      <div className="radio-selector-header radio-selectable" onClick={toggleCollapse}>
        <label className="radio-selector-title">{title}</label>
        <i className={`fas fa-chevron-${state.collapse ? 'up' : 'down'}`}></i>
      </div>
      <div className="radio-selections">
        {!state.collapse && options.map((option, index) => 
          <RadioButton key={index} option={option} select={optionIsTarget(option)} onClick={toggleOption(option)} />
        )}
      </div>
    </div>
  );
}

export default RadioMultiSelector;

// const accumulator = (option: RadioButtonOptions) => option.defaultSelection;
// (multiple ? options.filter(accumulator) : (() => { 
//   const s = options.find(accumulator);
//   return s ? [s] : [];
// })()),

// const optionSelected = (targetOption: RadioButtonOptions) => !!state.selectedOptions.find(option => option === targetOption);
// const selectOption = (option: RadioButtonOptions) => {
//   const selectedOptions = [...state.selectedOptions];
//   selectedOptions.push(option);
//   setState({ ...state, selectedOptions });
//   onOptionChange?.(selectedOptions);
// }

// const unselectOption = (targetOption: RadioButtonOptions) => {
//   const selectedOptions = state.selectedOptions.filter(option => option !== targetOption);
//   setState({ ...state, selectedOptions });
//   onOptionChange?.(selectedOptions);
// }

// const toggleOption = (option: RadioButtonOptions) => () => {
//   if (multiple) {
//     if (!optionSelected(option)) {
//       if (!multiple && state.selectedOptions.length != 0) {
//         return;
//       }

//       selectOption(option);
//     } else {
//       unselectOption(option)
//     }
//   } else {
//     if (!optionSelected(option)) {
//       setState({ ...state, selectedOptions: [option] });
//       onOptionChange?.([option]);
//     }
//   }
// }