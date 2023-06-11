import { ReactNode, useEffect, useRef, useState } from "react";
import TextInputField from "../../components/TextInputField";
import useInputField, { InputField, InputFieldError, useInputFieldUnbounding } from "./input-field-hook";
import { ArgumentTypes } from "../utils/types";

export interface GenericInputOptions {
  readonly placeholder?: string;
  readonly type?: 'text' | 'datetime-local' | 'email' | 'password';
  readonly disabled?: boolean;
}

type TextInputFieldHook<T> = InputField.GenericHook<GenericInputOptions, {}, string, T>;
const useTextInputField = function<T = string>(options: ArgumentTypes<TextInputFieldHook<T>>[0]): ReturnType<TextInputFieldHook<T>> {
  const inputField = useInputField({
    onValueChange(data) {
      options.onChange?.(data);
    },
    ...options,
    validate: (data) => {
      if (options.required && data.trim() === '') {
        throw new InputFieldError('No input provided');
      }
      
      if (options.validate) {
        return options.validate(data);
      }
      
      console.warn(`No validation function provided for the (${options.label}) TextInputField hook. By default no formation will be applied for the validated returned value`)
      return data as any;
    },
    value: options.value?.toString() ?? '',
    anchor: options.anchor?.toString() ?? '',
  });

  const inputBlurHandler = () => {
    if (options.validationTimings?.includes(InputField.ValidationTiming.Blur)) {
      inputField.validate();
    }
  }

  const inputFieldUnbounding = useInputFieldUnbounding(inputBlurHandler);

  const inputClickHandler: React.MouseEventHandler<HTMLInputElement> = (event) => {
    inputField.statusApplier.restoreDefault()
  }

  const keyPressHandler: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (!options.validationTimings?.includes(InputField.ValidationTiming.Submit)) {
      return;
    }

    const validatedResult = inputField.validate();
    if (!validatedResult.isValid) {
      return;
    }

    options.onSubmit?.(validatedResult.data);
  }

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    options.onChange?.(event.target.value);
    inputField.setValue(event.target.value)
  }

  const focusHandler: React.FocusEventHandler<HTMLInputElement> = () => {
    inputFieldUnbounding.onFocus();
  }

  const restoreValue = () => {
    inputField.setValue(inputField.anchor);
    options?.onRestore?.();
  }

  const clearValue = () => {
    inputField.setValue('');
    options?.onClear?.();
  }

  const shouldAllowInputClear = !!inputField.value && !options.disabled;
  const shouldAllowInputRestore = inputField.value !== inputField.anchor && inputField.anchor !== '' && !options.disabled;

  const render = () => (
    <TextInputField
      label=''
      type={options.type}
      value={inputField.value}
      placeholder={options.placeholder}
      {...inputField.inputFieldComponentProps}
      onInputClear={shouldAllowInputClear && clearValue}
      onInputRestore={shouldAllowInputRestore && restoreValue}
      disabled={options.disabled}
      
      onUnbound={() => inputFieldUnbounding.onUnbound()}
      onChange={changeHandler}
      onClick={inputClickHandler}
      onKeyPress={keyPressHandler}
      onFocus={focusHandler}
    />
  )

  return {
    ...inputField,
    restoreValue,
    clearValue,
    render,
  }
}

export default useTextInputField;
