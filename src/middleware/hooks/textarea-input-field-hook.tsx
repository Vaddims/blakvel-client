import AppTextarea from "../../components/TextareaInputField";
import useInputField, { InputField } from "./input-field-hook";

interface TextareaInputFieldOptions {
  readonly label?: string;
}

export type AppTextareaInputHook = InputField.GenericHook<TextareaInputFieldOptions, {}, string, string>;
const useTextareaInputField: AppTextareaInputHook = (options) => {
  const inputField = useInputField({
    validate: (data) => data,
    ...options,
    value: options.value ?? '',
    anchor: options.anchor ?? '',
  })

  const {
    label,
  } = options;

  const inputChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    inputField.setValue(event.target.value)
  }

  const restoreValue = () => {
    inputField.setValue(inputField.anchor);
  }

  const clearValue = () => {
    inputField.setValue('');
  }

  const shouldAllowInputRestore = inputField.value !== inputField.anchor;
  const shouldAllowInputClear = inputField.value.trim() !== '';

  const render = () => (
    <AppTextarea
      label={label ?? ''}
      value={inputField.value}
      onInputRestore={shouldAllowInputRestore && restoreValue}
      onInputClear={shouldAllowInputClear && clearValue}
      onChange={inputChangeHandler}
      {...inputField.inputFieldComponentProps}
    />
  )

  return {
    ...inputField,
    restoreValue,
    clearValue,
    render,
  }
}

export default useTextareaInputField;