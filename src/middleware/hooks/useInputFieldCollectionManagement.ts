import { useState } from "react"
import { InputField } from "./input-field-hook";

export interface FieldDescriptor<T> {
  readonly payload: T;
  readonly status: InputField.Status;
  readonly staticHelperText?: string;
  readonly helperText?: string;
}

export interface InputFieldCollectionManagementOptions<T, K = any> {
  readonly validationTimings?: InputField.ValidationTiming[];
  readonly initialDescriptors?: FieldDescriptor<T>[];
  readonly format?: (payload: T, input: string) => K;
}

export const useInputFieldCollectionManagement = <T, K = any>(options?: InputFieldCollectionManagementOptions<T, K>): InputFieldCollectionManagement<T, K> => {
  const {
    validationTimings = [],
    initialDescriptors = [],
    format: formatInput,
  } = options ?? {};

  const [ fieldDescriptors, setFieldDescriptors ] = useState([...initialDescriptors]);
  const findDescriptor = (payload: T) => {
    return fieldDescriptors.find(descriptor => descriptor.payload === payload);
  }

  const setDescriptors = (descriptors: FieldDescriptor<T>[]) => {
    setFieldDescriptors([...descriptors]);
  }

  const createDescriptor = (payload: T, status: InputField.Status, staticHelperText?: string) => {
    const newFieldDescriptors: FieldDescriptor<T>[] = [...fieldDescriptors];
    newFieldDescriptors.push({
      payload,
      status,
      staticHelperText,
      helperText: staticHelperText,
    });

    setFieldDescriptors(newFieldDescriptors);
  }

  const updateOneDescriptor = (payload: T, status: InputField.Status, helperText?: string) => {
    setFieldDescriptors((prevState => {
      const newFieldDescriptors: FieldDescriptor<T>[] = [];
      for (const descriptor of prevState) {
        if (descriptor.payload !== payload) {
          newFieldDescriptors.push(descriptor);
          continue;
        }
  
        newFieldDescriptors.push({
          payload: descriptor.payload,
          staticHelperText: descriptor.staticHelperText,
          status,
          helperText,
        });
      }

      return newFieldDescriptors;
    }));
  }

  const onInputClick = (payload: T): React.MouseEventHandler<HTMLInputElement> => () => {
    informationAlert.restore(payload);
  }

  const validateValue = (payload: T, input: string) => {
    if (!formatInput) {
      throw new Error('No input formatter provided');
    }

    try {
      return formatInput(payload, input);
    } catch (exception) {
      if (!(exception instanceof Error)) {
        throw new Error(`Validation exception is not an error`);
      }

      informationAlert.display(payload, InputField.Status.Error, exception.message);
      throw exception;
    }
  }

  const informationAlert = {
    display(payload: T, status: InputField.Status, helperText?: string) {
      if (status === InputField.Status.Default) {
        const descriptor = findDescriptor(payload);
        if (!descriptor) {
          return;
        }
        
        updateOneDescriptor(payload, InputField.Status.Default, descriptor.staticHelperText);
        return;
      }

      updateOneDescriptor(payload, status, helperText ?? '');
    },
    restore(payload: T) {
      const descriptor = findDescriptor(payload);
      if (!descriptor) {
        return;
      }
      
      updateOneDescriptor(payload, InputField.Status.Default, descriptor.staticHelperText);
    }
  }

  return {
    formatInput,
    validateValue,
    findDescriptor,
    onInputClick,
    updateOneDescriptor,
    setDescriptors,
    createDescriptor,
    informationAlert,
    fieldDescriptors,
  }
}

export interface InputFieldCollectionManagement<T, K> {
  formatInput: ((payload: T, input: string) => K) | undefined
  validateValue: (payload: T, input: string) => K
  onInputClick: (payload: T) => React.MouseEventHandler<HTMLInputElement>;
  findDescriptor: (payload: T) => FieldDescriptor<T> | undefined;
  updateOneDescriptor: (payload: T, status: InputField.Status, helperText?: string) => void;
  setDescriptors: (descriptors: FieldDescriptor<T>[]) => void;
  createDescriptor: (payload: T, status: InputField.Status, staticHelperText?: string) => void;
  
  informationAlert: {
    display(payload: T, status: InputField.Status, helperText?: string): void;
    restore(payload: T): void;
  };
  fieldDescriptors: FieldDescriptor<T>[]
}