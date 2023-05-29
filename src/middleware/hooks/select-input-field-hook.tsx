import { useEffect, useState } from "react";
import AppSelect from "../../components/SelectInputField"
import useInputField, { InputField } from "./input-field-hook";

interface Option {
  readonly title: string;
  readonly value: string;
  readonly defaultSelection?: boolean;
}

interface SelectInputFieldOptions {
  readonly label: string;
  readonly value?: any;
  readonly options: Option[];
  readonly required?: boolean;
}

export interface SelectInputFieldState {
  readonly defaultOption: Option;
}

type SelectInputFieldHook = InputField.GenericHook<SelectInputFieldOptions, SelectInputFieldState, Option, Option>;
const useSelectInputField: SelectInputFieldHook = (selectorOptions) => {
  const {
    label,
    options,
    required = false,
  } = selectorOptions;

  const defaultOption: Option = {
    title: 'None',
    value: '',
  }

  const appInput = useInputField<Option, Option>({
    validate: (option) => option,
    ...selectorOptions,
    value: selectorOptions.value ?? defaultOption,
    anchor: selectorOptions.anchor ?? defaultOption,
  });

  const displayOptions = [...options];
  displayOptions.unshift(defaultOption);

  const restoreValue = () => {
    appInput.setValue(appInput.anchor);
  }

  const clearValue = () => {
    appInput.setValue(defaultOption);
  }

  const findOption = (optionValue: string) => {
    return displayOptions.find(option => option.value === optionValue);
  }

  const onInputChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    appInput.setValue(findOption(event.target.value) ?? defaultOption)
  }

  const setValue = (option: Option | null, useAsAnchor = false) => {
    appInput.setValue(option ?? defaultOption, useAsAnchor);
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
    defaultOption,
    restoreValue,
    clearValue,
    setValue,
    render,
  }
}

export default useSelectInputField;