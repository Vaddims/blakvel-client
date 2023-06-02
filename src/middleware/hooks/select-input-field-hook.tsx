import { useEffect, useState } from "react";
import AppSelect from "../../components/SelectInputField"
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

  const appInput = useInputField<SelectInputFieldOption, SelectInputFieldOption>({
    validate: (option) => option,
    ...selectorOptions,
    value: selectorOptions.value ?? defaultSelectInputFieldOption,
    anchor: selectorOptions.anchor ?? defaultSelectInputFieldOption,
  });

  const displayOptions = [...options];
  displayOptions.unshift(defaultSelectInputFieldOption);

  const restoreValue = () => {
    appInput.setValue(appInput.anchor);
  }

  const clearValue = () => {
    appInput.setValue(defaultSelectInputFieldOption);
  }

  const findOption = (optionValue: string) => {
    return displayOptions.find(option => option.value === optionValue);
  }

  const onInputChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    appInput.setValue(findOption(event.target.value) ?? defaultSelectInputFieldOption)
  }

  const setValue = (option: SelectInputFieldOption | null, useAsAnchor = false) => {
    appInput.setValue(option ?? defaultSelectInputFieldOption, useAsAnchor);
  }

  const shouldAllowInputRestore = appInput.value !== appInput.anchor && appInput.anchor.value !== '';
  const shouldAllowInputClear = appInput.value.value !== '';

  const render = () => (
    <AppSelect
      label={label} 
      markAsRequired={required}
      onInputRestore={shouldAllowInputRestore && restoreValue}
      onInputClear={shouldAllowInputClear && clearValue}
      onChange={onInputChange}
    >
      {displayOptions.map(option => (
        <option 
          selected={option.value === appInput.value.value} 
          disabled={option.value === '' && required}
          value={option.value}
        >
          {(option.value === '' && required) ? `Choose option` : option.title}
        </option>
      ))}
    </AppSelect>
  );

  return {
    ...appInput,
    defaultOption: defaultSelectInputFieldOption,
    restoreValue,
    clearValue,
    setValue,
    render,
  }
}

export default useSelectInputField;