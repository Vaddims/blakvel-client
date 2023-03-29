import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { InputField, InputFieldDatalistElement, InputStatus } from '../../components/InputField';

export const composedValueAbordSymbol: unique symbol = Symbol('ComposedValueAbord');

export enum ValidationTiming {
  OnBlur,
  OnChange,
}

export interface InputFieldManagement<T> {
  readonly label: string;
  readonly labelIcon?: IconDefinition;
  readonly description?: string;
  readonly initialInputValue?: string;
  readonly inputInitialDatalist?: InputFieldDatalistElement[];
  readonly validationTimings?: ValidationTiming[];
  readonly required?: boolean; 

  readonly format?: (input: string) => T;
  readonly onInputBlur?: () => void;
  readonly onInputChange?: (input: string) => void;
  readonly onSubmit?: (data: T) => void;
}

export function useInputFieldManagement<T>(options: InputFieldManagement<T>) {
  const { 
    label,
    labelIcon,
    initialInputValue = '',
    inputInitialDatalist = [],
    validationTimings = [ValidationTiming.OnBlur],
    required = false,
    format: formatInput,
    description: staticDescription = '',
    onInputChange: inputChangeCallback,
    onInputBlur: inputBlurCallback,
    onSubmit: onInputSubmit,
  } = options;

  const [ inputValue, setInputValue ] = useState(initialInputValue);
  const [ anchorValue, setAnchorValue ] = useState(initialInputValue);
  const [ description, setDescription ] = useState(staticDescription);
  const [ status, setStatus ] = useState(InputStatus.Default);
  const [ inputDatalist, setInputDatalist ] = useState(inputInitialDatalist);

  const informationAlert = {
    display(status: InputStatus, description?: string) {
      setStatus(status);

      if (status === InputStatus.Default) {
        setDescription(staticDescription);
        return;
      }

      setDescription(description ?? '');
    },
    hide() {
      setStatus(InputStatus.Default);
    }
  }

  const onInputRestore = () => {
    restoreInputValue();
  }

  const onClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    informationAlert.display(InputStatus.Default, staticDescription);
  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.target.value;
    setInputValue(input);
    inputChangeCallback?.(input);

    if (validationTimings.includes(ValidationTiming.OnChange)) {
      try {
        if (!formatInput) {
          return;
        }

        if (input === anchorValue) {
          return;
        }
        
        formatInput(input);

        informationAlert.display(InputStatus.Valid);
      } catch {
        informationAlert.hide();
      }
    }
  }

  const onInputBlur = () => {
    inputBlurCallback?.();

    if (inputValue === anchorValue) {
      informationAlert.display(InputStatus.Default);
      return;
    }

    if (validationTimings.includes(ValidationTiming.OnBlur)) {
      const composedValue = getValidatedResult(inputValue);

      if (composedValue === composedValueAbordSymbol) {
        return;
      }
  
      if (inputValue === anchorValue) {
        return;
      }

      if (inputValue === '') {
        informationAlert.display(InputStatus.Default);
        return;
      }
  
      informationAlert.display(InputStatus.Valid);
      return;
    }
  }

  const getFormattedResult = (value: string) => {
    if (!formatInput) {
      throw new Error('No input formatter provided');
    }

    if (required && inputValue === '') {
      return composedValueAbordSymbol;
    }
    
    try {
      return formatInput(value);
    } catch {
      return composedValueAbordSymbol;
    }
  }

  const validateValue = (value: string) => {
    if (!formatInput) {
      throw new Error('No input formatter provided');
    }

    try {
      if (required && inputValue === '') {
        throw new Error('Field is required');
      }

      return formatInput(value);
    } catch (exception) {
      if (!(exception instanceof Error)) {
        throw new Error(`Validation exception is not an error`);
      }

      informationAlert.display(InputStatus.Invalid, exception.message);
      throw exception;
    }
  }

  const getValidatedResult = (value: string): T | typeof composedValueAbordSymbol => {
    try {
      return validateValue(value);
    } catch {
      return composedValueAbordSymbol;
    }
  }

  const validateInput = () => validateValue(inputValue);
  const getValidatedInputResult = () => getValidatedResult(inputValue);
  const getFormattedInputResult = () => getFormattedResult(inputValue);

  const updateInputValue = (value: string, isAnchor = false) => {
    setInputValue(value);

    if (isAnchor) {
      setAnchorValue(value);
      return;
    }

    const anchor = isAnchor ? value : anchorValue;

    if (value === anchor) {
      informationAlert.hide();
      return;
    }

    const composedValue = getValidatedResult(value);

    if (composedValue === composedValueAbordSymbol) {
      return;
    }

    if (value === anchor) {
      informationAlert.display(InputStatus.Default);
      return;
    }

    informationAlert.display(InputStatus.Valid);
    return;
  }

  const onKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    const validatedInputResult = getValidatedInputResult();
    if (validatedInputResult === composedValueAbordSymbol) {
      return;
    }

    onInputSubmit?.(validatedInputResult);
  }

  const updateAnchorValue = (newAnchorValue: string) => {
    setAnchorValue(newAnchorValue);
  }

  const restoreInputValue = () => {
    updateInputValue(anchorValue);
  }

  const updateDatalist = (datalist: InputFieldDatalistElement[]) => {
    setInputDatalist([...datalist]);
  }

  const render = () => (
    <InputField
      label={label}
      labelIcon={labelIcon}
      inputDatalist={inputDatalist}
      description={description}
      required={required}
      status={status}
      value={inputValue}
      onInputRestore={onInputRestore}
      onClick={onClick}
      onChange={onInputChange}
      onBlur={onInputBlur}
      onKeyPress={onKeyPress}
    />
  )

  return {
    inputValue,
    setInputValue: updateInputValue,
    setAnchorValue: updateAnchorValue,
    setInputDatalist: updateDatalist,
    restoreInputValue,
    validateInput,
    getValidatedInputResult,
    getFormattedInputResult,
    render,
  }
} 