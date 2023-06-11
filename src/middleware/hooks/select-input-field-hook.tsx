import { useEffect, useState } from "react";
import SelectInputField from "../../components/SelectInputField"
import useInputField, { InputField } from "./input-field-hook";

export interface SelectInputFieldOption {
  readonly title: string;
  readonly value: string;
  readonly defaultSelection?: boolean;
}

interface SelectInputFieldOptions {
  readonly label: string;
  readonly value?: any;
  readonly options: SelectInputFieldOption[];
  readonly required?: boolean;
}

export interface SelectInputFieldState {
  readonly defaultOption: SelectInputFieldOption;
}

export const defaultSelectInputFieldOption: SelectInputFieldOption = {
  title: 'None',
  value: '',
}

type SelectInputFieldHook = InputField.GenericHook<SelectInputFieldOptions, SelectInputFieldState, SelectInputFieldOption, SelectInputFieldOption>;
const useSelectInputField: SelectInputFieldHook = (selectorOptions) => {
  const {
    label,
    options,
    required = false,
  } = selectorOptions;

  const inputField = useInputField<SelectInputFieldOption, SelectInputFieldOption>({
    validate: (option) => option,
    ...selectorOptions,
    value: selectorOptions.value ?? defaultSelectInputFieldOption,
    anchor: selectorOptions.anchor ?? defaultSelectInputFieldOption,
  });

  const displayOptions = [...options];
  displayOptions.unshift(defaultSelectInputFieldOption);

  const restoreValue = () => {
    inputField.setValue(inputField.anchor);
  }

  const clearValue = () => {
    inputField.setValue(defaultSelectInputFieldOption);
  }

  const findOption = (optionValue: string) => {
    return displayOptions.find(option => option.value === optionValue);
  }

  const onInputChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    inputField.setValue(findOption(event.target.value) ?? defaultSelectInputFieldOption)
  }

  const setValue = (option: SelectInputFieldOption | null, useAsAnchor = false) => {
    inputField.setValue(option ?? defaultSelectInputFieldOption, useAsAnchor);
  }

  const shouldAllowInputRestore = inputField.value !== inputField.anchor && inputField.anchor.value !== '';
  const shouldAllowInputClear = inputField.value.value !== '' && !selectorOptions.required;

  const render = () => (
    <SelectInputField
      label={label} 
      markAsRequired={required}
      onInputRestore={shouldAllowInputRestore && restoreValue}
      onInputClear={shouldAllowInputClear && clearValue}
      onChange={onInputChange}
      {...inputField.inputFieldComponentProps}
    >
      {displayOptions.map(option => (
        <option 
          selected={option.value === inputField.value.value} 
          disabled={option.value === '' && required}
          value={option.value}
        >
          {(option.value === '' && required) ? `Choose option` : option.title}
        </option>
      ))}
    </SelectInputField>
  );

  return {
    ...inputField,
    defaultOption: defaultSelectInputFieldOption,
    restoreValue,
    clearValue,
    setValue,
    render,
  }
}

export default useSelectInputField;