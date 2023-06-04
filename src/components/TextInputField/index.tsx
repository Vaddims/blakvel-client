import { useState } from 'react';
import InputField, { extractInputFieldProps, InputFieldCommonProps } from '../InputField';
import { v4 as createUUID } from 'uuid';
import './text-input-field.scss';

export interface InputFieldDatalistElement {
  readonly name: string;
  readonly description?: string;
}

interface TextInputField extends InputFieldCommonProps, React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  readonly inputDatalist?: InputFieldDatalistElement[];
}

const TextInputField: React.FC<TextInputField> = (props) => {
  const [ inputId ] = useState(createUUID());
  const inputElementId = `input-${inputId}`;
  const tagDatalistElementId = `datalist-${inputElementId}`;

  return (
    <InputField
      {...extractInputFieldProps(props)}
      inputId={inputElementId}
      className='text-input-field'
    >
      <input
        {...props}
        id={inputElementId}
        required={props.markAsRequired}
        readOnly={props.readOnly ?? !props.onChange}
      />
      <datalist id={tagDatalistElementId}>
        {props.inputDatalist?.map((element) => (
          <option value={element.name} key={element.name}>{element.description}</option>
        ))}
      </datalist>
    </InputField>
  )
}

export default TextInputField;