import { useState } from "react";
import AppTextarea from "../../../components/AppTextarea";

interface AppTextareaComponentOptions {
  readonly label: string;
}

const useAppTextareaComponent = (options: AppTextareaComponentOptions) => {
  const [ value, setValue ] = useState('');
  const [ anchor, setAnchor ] = useState('');
  const {
    label,
  } = options;

  const render = () => (
    <AppTextarea
      onInputChange={(e) => setValue(e.target.value)}
      label={label}
      value={value}
    />
  )

  const setInputValue = (value: string, isAnchor = false) => {
    setValue(value);

    if (isAnchor) {
      setAnchor(value);
    }
  }

  return {
    value,
    setInputValue,
    render,
  }
}

export default useAppTextareaComponent;