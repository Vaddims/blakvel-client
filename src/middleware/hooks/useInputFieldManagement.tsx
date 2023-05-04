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
  readonly inputIcon?: IconDefinition;
  readonly placeholder?: string;
  readonly helperText?: string;
  readonly type?: 'text' | 'time' | 'datetime-local' | 'email' | 'password';
  readonly initialInputValue?: string;
  readonly inputInitialDatalist?: InputFieldDatalistElement[];
  readonly validationTimings?: ValidationTiming[];
  readonly required?: boolean; 
  readonly hideOptionalLabel?: boolean;

  readonly format?: (input: string) => T;
  readonly onInputBlur?: () => void;
  readonly onInputChange?: (input: string) => void;
  readonly onSubmit?: (data: T) => void;
}

export function useInputFieldManagement<T>(options: InputFieldManagement<T>): InputFieldManagementHook.Result<T> {
  const { 
    label,
    labelIcon,
    inputIcon,
    placeholder,
    type,
    initialInputValue = '',
    inputInitialDatalist = [],
    validationTimings = [ValidationTiming.OnBlur],
    required = false,
    hideOptionalLabel = false,
    format: formatInput,
    helperText: staticHelperText = '',
    onInputChange: inputChangeCallback,
    onInputBlur: inputBlurCallback,
    onSubmit: onInputSubmit,
  } = options;

  const [ inputValue, setInputValue ] = useState(initialInputValue);
  const [ anchorValue, setAnchorValue ] = useState(initialInputValue);
  const [ helperText, setDescription ] = useState(staticHelperText);
  const [ status, setStatus ] = useState(InputStatus.Default);
  const [ inputDatalist, setInputDatalist ] = useState(inputInitialDatalist);
  
  const informationAlert = {
    display(status: InputStatus, description?: string) {
      setStatus(status);

      if (status === InputStatus.Default) {
        setDescription(staticHelperText);
        return;
      }

      setDescription(description ?? '');
    },
    restore() {
      setStatus(InputStatus.Default);
      setDescription(staticHelperText);
    }
  }

  const handleInputRestore: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    restoreInputValue();
  }

  const handleInputClear: React.MouseEventHandler<HTMLButtonElement> = () => {
    updateInputValue('');
  }

  const handleInputClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    informationAlert.display(InputStatus.Default, staticHelperText);
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.target.value;
    inputChangeCallback?.(input);
    setInputValue(input);

    if (validationTimings.includes(ValidationTiming.OnChange)) {
      if (input === anchorValue) {
        informationAlert.restore();
        return;
      }

      if (!formatInput) {
        if (input === '') {
          informationAlert.restore();
          return;
        }

        informationAlert.restore();
        return;
      }

      try {
        formatInput(input);
        informationAlert.restore();
      } catch {
        informationAlert.restore();
      }
    }
  }

  const handleInputBlur = () => {
    inputBlurCallback?.();

    if (inputValue === anchorValue && anchorValue !== '') {
      informationAlert.display(InputStatus.Default);
      return;
    }

    if (validationTimings.includes(ValidationTiming.OnBlur)) {
      try {
        validateInput();
        if (inputValue === '') {
          informationAlert.restore();
          return;
        }

        informationAlert.restore();
      } catch {}
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

  const updateStaticDescription = (value: string) => {
    setDescription(value);
  }

  const updateInputValue = (value: string, isAnchor = false) => {
    setInputValue(value);

    if (isAnchor) {
      setAnchorValue(value);
      return;
    }

    const anchor = isAnchor ? value : anchorValue;

    if (value === anchor) {
      informationAlert.restore();
      return;
    }

    const composedValue = getValidatedResult(value);

    if (composedValue === composedValueAbordSymbol) {
      return;
    }

    if (value === anchor) {
      informationAlert.restore();
      return;
    }

    informationAlert.restore();
    return;
  }

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
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
      inputIcon={inputIcon}
      placeholder={placeholder}
      inputDatalist={inputDatalist}
      helperText={helperText}
      type={type}
      hideOptionalLabel={hideOptionalLabel}
      anchor={anchorValue}
      required={required}
      status={status}
      value={inputValue}
      onInputRestore={handleInputRestore}
      onInputClear={handleInputClear}
      onClick={handleInputClick}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyPress={handleKeyPress}
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
    setStaticDescription: updateStaticDescription,
    format: formatInput,
    render,
  }
} 

export namespace InputFieldManagementHook {
  export type SetInputValue = (value: string, isAnchor?: boolean) => void;
  export type SetAnchorValue = (newAnchorValue: string) => void;
  export type SetInputDatalist = (datalist: InputFieldDatalistElement[]) => void;
  export type GetComposedInputResult<T> = () => T | typeof composedValueAbordSymbol;


  export interface Result<T> {
    readonly inputValue: string;
    readonly setInputValue: SetInputValue;
    readonly setAnchorValue: SetAnchorValue;
    readonly setInputDatalist: SetInputDatalist;
    readonly restoreInputValue: () => void;
    readonly format: ((input: string) => T) | undefined;
    readonly validateInput: () => T;
    readonly getValidatedInputResult: GetComposedInputResult<T>;
    readonly getFormattedInputResult: GetComposedInputResult<T>;
    readonly render: () => JSX.Element;
    readonly setStaticDescription: (value: string) => void;
  }
}