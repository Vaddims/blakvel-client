import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { InputField, InputFieldDatalistElement, InputStatus } from '../../components/InputField';

export const composedValueAbordSymbol: unique symbol = Symbol('ComposedValueAbord');

export enum ValidationTiming {
  AfterBlur,
  OnChange,
  OnBoth,
}

export interface InputFieldManagement<T> {
  readonly label: string;
  readonly labelIcon?: IconDefinition;
  readonly description?: string;
  readonly initialInputValue?: string;
  readonly inputInitialDatalist?: InputFieldDatalistElement[];
  readonly validationTiming?: ValidationTiming;
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
    validationTiming = ValidationTiming.AfterBlur,
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

  const displayInformationAlert = (status: InputStatus, description?: string) => {
    setStatus(status);
    setDescription(description ?? '');
  }

  const hideInformationAlert = () => {
    setStatus(InputStatus.Default);
    setDescription(staticDescription);
  }

  const onInputRestore = () => {
    restoreInputValue();
  }

  const onClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (validationTiming !== ValidationTiming.OnChange && validationTiming !== ValidationTiming.OnBoth) {
      displayInformationAlert(InputStatus.Default);
    }
  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.target.value;
    setInputValue(input);
    inputChangeCallback?.(input);

    if (validationTiming === ValidationTiming.OnChange || validationTiming === ValidationTiming.OnBoth) {
      try {
        if (!formatInput) {
          return;
        }

        formatInput(input);
        if (input === anchorValue) {
          return;
        }

        displayInformationAlert(InputStatus.Valid);
      } catch {
        hideInformationAlert();
      }
    }
  }

  const onInputBlur = () => {
    inputBlurCallback?.();

    if (validationTiming === ValidationTiming.AfterBlur) {
      const composedValue = getValidatedResult(inputValue);

      if (composedValue === composedValueAbordSymbol) {
        return;
      }
  
      if (inputValue === anchorValue) {
        return;
      }
  
      displayInformationAlert(InputStatus.Valid);
      return;
    }
  }

  const validateValue = (value: string) => {
    if (!formatInput) {
      throw new Error('No input formatter provided');
    }

    try {
      return formatInput(value);
    } catch (exception) {
      if (!(exception instanceof Error)) {
        throw new Error(`Validation exception is not an error`);
      }

      displayInformationAlert(InputStatus.Invalid, exception.message);
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

  const validateInput = () => validateValue(inputValue)
  const getValidatedInputResult = () => getValidatedResult(inputValue)

  const updateInputValue = (value: string, isAnchor = false) => {
    setInputValue(value);

    if (isAnchor) {
      setAnchorValue(value);
      return;
    }

    const anchor = isAnchor ? value : anchorValue;

    if (value === anchor) {
      hideInformationAlert();
      return;
    }

    const composedValue = getValidatedResult(value);

    if (composedValue === composedValueAbordSymbol) {
      return;
    }

    if (value === anchor) {
      displayInformationAlert(InputStatus.Default);
      return;
    }

    displayInformationAlert(InputStatus.Valid);
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
    render,
  }
} 