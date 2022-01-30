import { useEffect, useState } from 'react';
import RadioButton, { RadioButtonOption } from '../radio-button';
import "./radio-selector.scss";

interface RadioSingleSelectorProps {
  title: string;
  collapse?: boolean;
  collapsible?: boolean;
  target?: RadioButtonOption | null;
  options: RadioButtonOption[];
  onTargetChange?: (options: RadioButtonOption) => void;
}

interface RadioSingleSelectorState {
  targetOption: RadioButtonOption | null;
  collapse: boolean;
}

function RadioSingleSelector(props: RadioSingleSelectorProps) {
  const { title, collapse, options, onTargetChange, target } = props;

  const defaultTargetOption = () => options.find(option => option.defaultSelection) ?? null;
  const requestedTargetOption = () => typeof target === 'undefined' ? defaultTargetOption() : target;

  const [state, setState] = useState<RadioSingleSelectorState>({
    targetOption: requestedTargetOption(),
    collapse: collapse ?? false,
  });

  useEffect(() => {
    setState({ 
      ...state, 
      targetOption: requestedTargetOption(),
    });
  }, [target]);

  const toggleCollapse = () => setState({ ...state, collapse: !state.collapse });
  const selectOption = (option: RadioButtonOption) => () => {
    if (state.targetOption !== option) {
      setState({ ...state, targetOption: option });
      onTargetChange?.(option);
    }
  }

  return (
    <div className="radio-selector">
      <div className="radio-selector-header radio-selectable" onClick={toggleCollapse}>
        <label className="radio-selector-title">{title}</label>
        <i className={`fas fa-chevron-${state.collapse ? 'up' : 'down'}`}></i>
      </div>
      <div className="radio-selections">
        {!state.collapse && options.map((option, index) => 
          <RadioButton key={Math.random()} option={option} select={option === state.targetOption} onClick={selectOption(option)} />
        )}
      </div>
    </div>
  );
}

export default RadioSingleSelector;