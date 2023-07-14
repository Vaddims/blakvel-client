import { useEffect, useRef, useState } from 'react';
import InputField, { extractInputFieldProps, InputFieldCommonProps } from '../InputField';
import { v4 as createUUID } from 'uuid';
import './text-input-field.scss';

export interface InputFieldDatalistElement {
  readonly name: string;
  readonly description?: string;
}

interface TextInputField extends InputFieldCommonProps, React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  readonly inputDatalist?: InputFieldDatalistElement[];
  readonly inputRef?: React.Ref<HTMLInputElement>;
}

const TextInputField: React.FC<TextInputField> = (props) => {
  const [ inputId ] = useState(createUUID());
  const inputElementId = `input-${inputId}`;
  const datalistElementId = `datalist-${inputElementId}`;

  return (
    <InputField
      {...extractInputFieldProps(props)}
      inputId={inputElementId}
      className='text-input-field'
    >
      <input
        {...props}
        ref={props.inputRef}
        id={inputElementId}
        list={datalistElementId}
        required={props.markAsRequired}
        readOnly={props.readOnly ?? !props.onChange}
      />
      <datalist id={datalistElementId}>
        {props.inputDatalist?.map((element) => (
          <option value={element.name} key={element.name}>{element.description}</option>
        ))}
      </datalist>
    </InputField>
  )
}

export default TextInputField;