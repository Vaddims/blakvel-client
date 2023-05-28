import { useLayoutEffect, useState } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { InputFieldCommonProps } from "../../components/InputField";

const useInputField = function<T, K>(options: InputField.Options<T, K>): InputField.State<T, K> {
  const [ value, setRawValue ] = useState<T>(options.value);
  const [ anchor, setRawAnchor ] = useState(options.anchor);
  const [ status, setRawStatus ] = useState(InputField.Status.Default);
  const [ helperText, setRawHelperText ] = useState<string | null>(options.helperText ?? null);

  useLayoutEffect(() => {
    if (options.validationTimings?.includes(InputField.ValidationTiming.Change)) {
      validate();
    }
  }, [value]);

  const setValue: InputField.State.SetValueFunction<T> = (data, useAsAnchor = false) => {
    setRawValue(data);
    options.onValueChange?.(data);
    if (useAsAnchor) {
      setRawAnchor(data);
    }
  }

  const setAnchor: InputField.State.SetAnchorFunction<T> = (data) => {
    setRawAnchor(data);
  }

  const setHelperText: InputField.State.SetHelperTextFunction = (data) => {
    setRawHelperText(data);
  }

  const statusApplier: InputField.State.StatusApplier = {
    restoreDefault() {
      setRawStatus(InputField.Status.Default);
      setRawHelperText(options.helperText ?? '');
    },
    useCustomDefault(data: string) {
      setRawStatus(InputField.Status.Default);
      setRawHelperText(data || helperText);
    },
    useError(error) {
      setRawStatus(InputField.Status.Error);
      setRawHelperText(error.message);
    },
  }

  const validateCustomValue: InputField.State.ValidateCustomValue<T, K> = (
    providedValue, 
    providedValidationFunction,
    ignoreErrorDisplay = false
  ) => {
    try {
      const data = providedValidationFunction?.(providedValue) ?? options.validate(providedValue);
      if (!ignoreErrorDisplay) {
        statusApplier.restoreDefault();
      }

      return {
        isValid: true,
        data,
      }
    } catch (error) {
      if (!(error instanceof InputFieldError)) {
        throw error;
      }

      if (!ignoreErrorDisplay) {
        statusApplier.useError(error);
      }

      return {
        isValid: false,
        error,
      }
    }
  }

  const validate: InputField.State.ValidateInputFunction<K> = (ignoreErrorDisplay = false) => {
    return validateCustomValue(value, options.validate, ignoreErrorDisplay);
  }

  const appInputComponentProps: InputFieldCommonProps = {
    label: options.label ?? '',
    inputIcon: options.inputIcon,
    labelIcon: options.labelIcon,
    markAsRequired: options.required,
    helperText: helperText || undefined,
    status,
  }

  return {
    value,
    helperText,
    anchor,
    statusApplier,
    appInputComponentProps,
    setValue,
    setAnchor,
    setHelperText,
    validate,
    validateCustomValue,
  }
}

export default useInputField;

export type InputCollectionResults<T> = {
  [key in keyof T]: T[key] extends InputField.ComponentState<any, infer U> 
  ? InputField.State.ValidationResult.Success<U> 
  : never;
}

export function validateComponentStateInputs<T>(inputCollection: T extends { [k: string]: InputField.ComponentState<any, any> } ? T : never) {
  const validationResults = {} as any;
  for (const key in Object.keys(inputCollection)) {
    const result = inputCollection[key].validate();
    if (!result.isValid) {
      return null;
    }

    validationResults[key] = result;
  }

  return validationResults as InputCollectionResults<T>;
}

export class InputFieldError extends Error {
  constructor (message: string) {
    super(message);
  }
}

export namespace InputField {
  export enum Status {
    Default = 'default',
    Error = 'error',
  }

  export enum ValidationTiming {
    Change,
    Submit,
    Blur,
  }

  export namespace Options {
    export interface ValidateInputFunction<T, K> {
      (input: T): K;
    }

    export interface ChangeInputFunction<T> {
      (data: T): void;
    }
  }

  export interface AppInputComponentOptions {
    readonly label?: string;
    readonly labelIcon?: IconDefinition;
    readonly inputIcon?: IconDefinition;
    readonly placeholder?: string;
    readonly required?: boolean;
  }

  export interface AppInputComponentProps {
    readonly label?: string;
    readonly labelIcon?: IconDefinition;
    readonly inputIcon?: IconDefinition;
    readonly placeholder?: string;
    readonly required?: boolean;
    readonly helperText?: string;
    readonly status?: InputField.Status;
  }

  export interface Options<T, K> extends AppInputComponentOptions {
    readonly value: T;
    readonly anchor: T;
    readonly helperText?: string | null;
    readonly disableValidationTimings?: boolean;
    readonly validationTimings?: ValidationTiming[];
    readonly validate: Options.ValidateInputFunction<T, K>;
    readonly onValueChange?: Options.ChangeInputFunction<T>; 
  }

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  export interface ComponentOptions<T, K> extends Omit<PartialBy<Options<T, K>, 'value' | 'anchor' | 'validate'>, 'onValueChange'> {
    readonly onChange?: InputField.State.ChangeInputFunction<T>;
    readonly onSubmit?: InputField.State.SubmitInputFunction<K>;
  }

  export namespace State {
    export interface RenderComponentFunction {
      (): JSX.Element;
    }

    export interface SetValueFunction<T> {
      (value: T, useAsAnchor?: boolean): void;
    }

    export interface SetAnchorFunction<T> {
      (value: T): void;
    }

    export interface ValidateInputFunction<T> {
      (ignoreErrorDisplay?: boolean): State.ValidationResult<T>;
    }

    export interface ValidateCustomValue<T, K> {
      (data: T, validationFunction?: Options.ValidateInputFunction<T, K>, ignoreErrorDisplay?: boolean): State.ValidationResult<K>;
    }

    export interface SubmitInputFunction<T> {
      (data: T): void;
    }

    export interface ChangeInputFunction<T> {
      (data: T): void;
    }

    export namespace ValidationResult {
      export interface Base {
        readonly isValid: true | false;
      }

      export interface Success<T> extends Base {
        readonly isValid: true;
        readonly data: T;
      }

      export interface Fail extends Base {
        readonly isValid: false;
        readonly error: InputFieldError;
      }
    }

    export type ValidationResult<T> = State.ValidationResult.Success<T> | State.ValidationResult.Fail;

    export interface SetHelperTextFunction {
      (helperText: string | null): void;
    }

    export interface StatusApplier {
      readonly restoreDefault: () => void;
      readonly useCustomDefault: (data: string) => void;
      readonly useError: (error: InputFieldError) => void;
    }
  }

  export interface State<T, K> {
    readonly value: T;
    readonly anchor: T;
    readonly helperText: string | null;

    readonly statusApplier: State.StatusApplier;

    readonly setValue: State.SetValueFunction<T>;
    readonly setAnchor: State.SetAnchorFunction<T>;
    readonly setHelperText: State.SetHelperTextFunction;
    readonly validate: State.ValidateInputFunction<K>;
    readonly validateCustomValue: State.ValidateCustomValue<T, K>;

    readonly appInputComponentProps: AppInputComponentProps;
  }

  export interface ComponentState<T, K> extends State<T, K> {
    readonly restoreValue: () => void;
    readonly clearValue: () => void;
    readonly render: State.RenderComponentFunction;
  }

  export interface GenericHook<TOptions extends object, TReturn extends object, T, K> {
    (options: TOptions & InputField.ComponentOptions<T, K>): TReturn & ComponentState<T, K>;
  }
}
