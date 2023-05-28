import AppTextarea from "../../components/TextareaInputField";
import useInputField, { InputField } from "./input-field-hook";

interface TextareaInputFieldOptions {
  readonly label?: string;
}

export type AppTextareaInputHook = InputField.GenericHook<TextareaInputFieldOptions, {}, string, string>;
const useTextareaInputField: AppTextareaInputHook = (options) => {
  const appInput = useInputField({
    value: '',
    anchor: '',
    validate: (data) => data,
    ...options,
  })

  const {
    label,
  } = options;

  const inputChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    appInput.setValue(event.target.value)
  }

  const restoreValue = () => {
    appInput.setValue(appInput.anchor);
  }

  const clearValue = () => {
    appInput.setValue('');
  }

  const shouldAllowInputRestore = appInput.value !== appInput.anchor;
  const shouldAllowInputClear = appInput.value.trim() !== '';

  const render = () => (
    <AppTextarea
      label={label ?? ''}
      value={appInput.value}
      onInputRestore={shouldAllowInputRestore && restoreValue}
      onInputClear={shouldAllowInputClear && clearValue}
      onChange={inputChangeHandler}
    />
  )

  return {
    ...appInput,
    restoreValue,
    clearValue,
    render,
  }
}

export default useTextareaInputField;