import { ReactNode, useEffect, useRef, useState } from "react";
import TextInputField from "../../components/TextInputField";
import useInputField, { InputField } from "./input-field-hook";
import { ArgumentTypes } from "../utils/types";

export interface GenericInputOptions {
  readonly placeholder?: string;
  readonly type?: 'text' | 'datetime-local' | 'email' | 'password';
}

type TextInputFieldHook<T> = InputField.GenericHook<GenericInputOptions, {}, string, T>;
const useTextInputField = function<T = string>(options: ArgumentTypes<TextInputFieldHook<T>>[0]): ReturnType<TextInputFieldHook<T>> {
  const appInput = useInputField({
    value: '',
    anchor: '',
    validate: (data) => {
      console.warn(`No validation function provided for the (${options.label}) TextInputField hook. By default no formation will be applied for the validated returned value`)
      return data as any;
    },
    onValueChange(data) {
      options.onChange?.(data);
    },
    ...options,
  });

  const [ onceFocused , setOnceFocused] = useState(false);
  const [ focused, setFocus ] = useState<boolean>();

  const inputBlurHandler = () => {
    if (options.validationTimings?.includes(InputField.ValidationTiming.Blur)) {
      appInput.validate();
    }
  }

  const inputClickHandler: React.MouseEventHandler<HTMLInputElement> = (event) => {
    appInput.statusApplier.restoreDefault()
  }

  const keyPressHandler: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (!options.validationTimings?.includes(InputField.ValidationTiming.Submit)) {
      return;
    }

    const validatedResult = appInput.validate();
    if (!validatedResult.isValid) {
      return;
    }

    options.onSubmit?.(validatedResult.data);
  }

  useEffect(() => {
    if (!focused && focused !== undefined && onceFocused) {
      inputBlurHandler?.();
    }
  }, [focused])

  const unboundHandler = (event: MouseEvent) => {
    if (focused) {
      setOnceFocused(true);
      setFocus(false);
    }
  }

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    options.onChange?.(event.target.value);
    appInput.setValue(event.target.value)
  }

  const focusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
    if (!focused) {
      setFocus(true);
    }
  }

  const restoreValue = () => {
    appInput.setValue(appInput.anchor);
  }

  const clearValue = () => {
    appInput.setValue('');
  }

  const shouldAllowInputClear = !!appInput.value;
  const shouldAllowInputRestore = appInput.value !== appInput.anchor && appInput.anchor !== '';

  const render = () => (
    <TextInputField
      label=''
      type={options.type}
      value={appInput.value}
      placeholder={options.placeholder}
      {...appInput.appInputComponentProps}
      onInputClear={shouldAllowInputClear && clearValue}
      onInputRestore={shouldAllowInputRestore && restoreValue}
      
      onUnbound={unboundHandler}
      onChange={changeHandler}
      onClick={inputClickHandler}
      onKeyPress={keyPressHandler}
      onFocus={focusHandler}
    />
  )

  return {
    ...appInput,
    restoreValue,
    clearValue,
    render,
  }
}

export default useTextInputField;
