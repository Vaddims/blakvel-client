import CheckboxField from "../../components/CheckboxField";
import useInputField, { InputField } from "./input-field-hook";

interface CheckboxFieldOptions {
  readonly onChange?: (select: boolean) => void;
}

interface CheckboxFieldResult {
  readonly toggleValue: () => void;
}

type CheckboxFieldHook = InputField.GenericHook<CheckboxFieldOptions, CheckboxFieldResult, boolean, boolean>;
const useCheckboxField: CheckboxFieldHook = (options) => {
  const defaultValue = false;
  const inputField = useInputField({
    value: defaultValue,
    anchor: defaultValue,
    validate: (input) => input,
    onValueChange: (data) => options.onChange?.(data),
    ...options,
  })

  const toggleValue = () => {
    const newSelectState = !inputField.value; 
    inputField.setValue(newSelectState);
  }

  const checkboxClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    toggleValue();
  }

  const restoreValue = () => {
    inputField.setValue(inputField.anchor);
  }

  const clearValue = () => {
    inputField.setValue(defaultValue);
  }

  const render = () => (
    <CheckboxField
      label=''
      {...inputField.appInputComponentProps}
      select={inputField.value}
      onClick={checkboxClickHandler}
    />
  );

  return {
    ...inputField,
    toggleValue,
    restoreValue,
    clearValue,
    render,
  }
}

export default useCheckboxField;