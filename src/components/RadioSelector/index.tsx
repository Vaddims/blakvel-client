import { useState } from "react";
import { useElementSelection } from "../../middleware/hooks/useElementSelection";
import { RadioButtonOptions } from "../RadioButton/radio-button-options.interface";
import RadioButton from "../RadioButton";
import "./radio-selector.scss";

type PrimitiveIdentifier = string | number | bigint | null | undefined;

export interface RadioSelectorOptions<Payload> {
  readonly title?: string;
  readonly collapse?: boolean;
  readonly collapsible?: boolean;
  readonly buttonOptions?: RadioButtonOptions<Payload>[];
  readonly dependencies?: unknown[];
  readonly identifyOptions?: (element: RadioButtonOptions<Payload>) => PrimitiveIdentifier;
}

interface RadioSingleSelectorProps<Payload> extends RadioSelectorOptions<Payload> {
  readonly multiple?: false | undefined;
  readonly initialTarget?: RadioButtonOptions<Payload>;
  readonly onSelectionChange?: (radioButtonOptions: RadioButtonOptions<Payload>) => void;
}

interface RadioMultipleSelectorProps<Payload> extends RadioSelectorOptions<Payload> {
  readonly multiple: true;
  readonly initialTarget?: RadioButtonOptions<Payload>[];
  readonly onSelectionChange?: (radioButtonOptions: RadioButtonOptions<Payload>[]) => void;
}

type RadioSelectorProps<Payload> = RadioSingleSelectorProps<Payload> | RadioMultipleSelectorProps<Payload>;

const RadioSelector = function<Payload>(props: RadioSelectorProps<Payload>) {
  const { 
    title = '', 
    initialTarget = [],
    buttonOptions = [],
    collapse = false, 
    collapsible = true,
    identifyOptions = (options: RadioButtonOptions<Payload>) => options.title,
  } = props;

  const [ collapsed, setCollapseState ] = useState(collapse);
  const toogleCollpaseState = () => {
    if (collapsible) {
      setCollapseState(!collapsed);
    }
  }
  
  const {
    selections,
    selectOneElement,
    toggleAdditionalElement,
    elementIsSelected,
  } = useElementSelection(buttonOptions, {
    targets: Array.isArray(initialTarget) ? initialTarget : [initialTarget],
    identifier: identifyOptions,
  });

  const onRadioButtonClick = (radioButtonOptions: RadioButtonOptions<Payload>) => () => {
    if (radioButtonOptions.disabled) {
      return;
    }

    if (props.multiple) {
      props.onSelectionChange?.([...selections, radioButtonOptions]);
      toggleAdditionalElement(radioButtonOptions);
      return;
    }

    props.onSelectionChange?.(radioButtonOptions);
    selectOneElement(radioButtonOptions);
  }

  return (
    <div className="radio-selector">
      <div className="radio-selector-header radio-selectable" onClick={toogleCollpaseState}>
        <label className="radio-selector-title">{title}</label>
        <i className={`fas fa-chevron-${collapsed ? 'up' : 'down'}`} />
      </div>
      <div className="radio-selections">
        {!collapsed && buttonOptions.map((radioButtonOptions, index) => 
          <RadioButton 
            key={index} 
            options={radioButtonOptions} 
            isSelected={elementIsSelected(radioButtonOptions)} 
            onClick={onRadioButtonClick(radioButtonOptions)}
          />
        )}
      </div>
    </div>
  )
}

export default RadioSelector;