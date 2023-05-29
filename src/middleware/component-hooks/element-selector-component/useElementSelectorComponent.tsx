import { useEffect, useState } from "react";
import ElementSelectorButtonOptions from "../../../components/ElementSelectorOption/element-selector-options.interface";
import { useElementSelection } from "../../hooks/useElementSelection";
import RadioButton from "../../../components/ElementSelectorOption";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import './element-selector.scss';

type PrimitiveIdentifier = string | number | bigint | null | undefined;

export interface ElementSelectorOptions<T> {
  readonly title?: string;
  readonly collapse?: boolean;
  readonly collapsible?: boolean;
  readonly dependencies?: unknown[];
  readonly trackInitialTarget?: boolean;
  readonly buttonOptions?: ElementSelectorButtonOptions<T>[];
  readonly identifyOptions?: (element: ElementSelectorButtonOptions<T>) => PrimitiveIdentifier;
}

interface SingleElementSelectorProps<T> extends ElementSelectorOptions<T> {
  readonly multiple?: false | undefined;
  readonly initialTarget?: ElementSelectorButtonOptions<T>;
  readonly onSelectionChange?: (radioButtonOptions: ElementSelectorButtonOptions<T>) => void;
}

interface MultipleElementSelectorProps<T> extends ElementSelectorOptions<T> {
  readonly multiple: true;
  readonly initialTarget?: ElementSelectorButtonOptions<T>[];
  readonly onSelectionChange?: (radioButtonOptions: ElementSelectorButtonOptions<T>[]) => void;
}

type RadioSelectorProps<T> = SingleElementSelectorProps<T> | MultipleElementSelectorProps<T>;

const useElementSelectorComponent = function<T>(props: RadioSelectorProps<T>) {
  const { 
    title = '', 
    multiple = false,
    initialTarget,
    buttonOptions = [],
    collapse = false, 
    collapsible = true,
    identifyOptions = (options: ElementSelectorButtonOptions<T>) => options.title,
  } = props;

  const [ collapsed, setCollapseState ] = useState(collapse);
  const toogleCollpaseState = () => {
    if (collapsible) {
      setCollapseState(!collapsed);
    }
  }

  const getTargets = () => {
    if (initialTarget) {
      return Array.isArray(initialTarget) ? initialTarget : [initialTarget];
    }

    if (multiple) {
      const options = buttonOptions.filter(option => option.defaultSelection) ?? []
      return [...options];
    }

    return buttonOptions.filter(b => b.defaultSelection) ?? [];
  }
  
  const elementSelection = useElementSelection(buttonOptions, {
    targets: getTargets(),
    identifier: identifyOptions,
  });

  
  const initialTargetsAsArray = initialTarget ? Array.isArray(initialTarget) ? initialTarget : [initialTarget] : [];
  useEffect(() => {
    if (props.trackInitialTarget) {
      elementSelection.selectMultipleElements(initialTargetsAsArray);
    }
  }, [initialTargetsAsArray.map(option => option.title).join('&')]);

  const onRadioButtonClick = (radioButtonOptions: ElementSelectorButtonOptions<T>) => () => {
    if (radioButtonOptions.disabled) {
      return;
    }

    if (props.multiple) {
      const newRadioButtonOptions = [...elementSelection.selections, radioButtonOptions];
      props.onSelectionChange?.([...newRadioButtonOptions]);
      elementSelection.toggleAdditionalElement(radioButtonOptions);
      return;
    }

    props.onSelectionChange?.(radioButtonOptions);
    elementSelection.selectOneElement(radioButtonOptions)
  }

  const render = () => (
    <div className="element-selector-component">
      <header onClick={toogleCollpaseState}>
        <label className="title">{title}<br /></label>
        <FontAwesomeIcon icon={collapsed ? faChevronUp : faChevronDown} />
      </header>
      <div className="selector-options">
        {!collapsed && buttonOptions.map((radioButtonOptions, index) => 
          <RadioButton 
            key={index} 
            options={radioButtonOptions} 
            isSelected={elementSelection.elementIsSelected(radioButtonOptions)} 
            onClick={onRadioButtonClick(radioButtonOptions)}
          />
        )}
      </div>
    </div>
  )

  return {
    render,
    ...elementSelection,
  }
}

export default useElementSelectorComponent;