import { useEffect, useState } from "react";
import AppSelect from "../../../components/AppSelect"

interface Option {
  readonly title: string;
  readonly value: string;
  readonly defaultSelection?: boolean;
}

interface AppSelectOptions {
  readonly label: string;
  readonly options: Option[];
  readonly required?: boolean;
  readonly initialTargetValue?: string;
}

const useAppSelectComponent = (selectorOptions: AppSelectOptions) => {
  const {
    label,
    options,
    required = false,
    initialTargetValue = '',
  } = selectorOptions;

  const displayOptions = [...options];

  const defaulOption: Option = {
    title: 'None',
    value: '',
  }

  displayOptions.unshift(defaulOption);

  const getInitialSelectedOption = () => {
    if (typeof initialTargetValue === 'string') {
      const option = displayOptions.find(option => option.value === initialTargetValue);
      if (!option) {
        throw new Error(`No option with the value ${initialTargetValue} was found for ${label} app select component`)
      }

      return option;
    }

    return defaulOption;
  }

  const [ selectedOption, setSelectedOption ] = useState(getInitialSelectedOption());
  const [ anchor, setAnchor ] = useState(initialTargetValue);

  useEffect(() => {
    setAnchor(initialTargetValue);
  }, [initialTargetValue]);

  const onInputRestore = () => {
    const anchoredOption = displayOptions.find(option => option.value === anchor);
    if (!anchoredOption) {
      return;
    }

    setSelectedOption(anchoredOption);
  }

  const onInputClear = () => {
    setSelectedOption(defaulOption)
  }

  const onInputChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSelectedOption(options.find(option => option.value === event.target.value) ?? defaulOption)
  }

  const render = () => (
    <AppSelect
      label={label} 
      required={required}
      shouldAllowInputRestore={selectedOption.value !== anchor && anchor !== ''}
      shouldAllowInputClear={selectedOption.value !== ''}
      onInputRestore={onInputRestore}
      onInputClear={onInputClear}
      onChange={onInputChange}
    >
      {displayOptions.map(option => (
        <option 
          selected={option.value === selectedOption.value} 
          disabled={option.value === '' && required}
          value={option.value}
        >
          {(option.value === '' && required) ? `Choose option` : option.title}
        </option>
      ))}
    </AppSelect>
  );

  const setInputValue = (value: string, isAnchor = false) => {
    const option = displayOptions.find(option => option.value === value);
    if (!option) {
      throw new Error('Option not found')
    }

    setSelectedOption(option);

    if (isAnchor) {
      setAnchor(option.value)
    }
  }

  return {
    value: selectedOption.value,
    setInputValue,
    render,
  }
}

export default useAppSelectComponent;