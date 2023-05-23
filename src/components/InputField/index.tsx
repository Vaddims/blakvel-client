import { faCheck, faRotateBack, faUserXmark, faWarning, faXmark, faXmarkCircle, faXRay, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './input-field.scss';
import AppInput from '../AppInput';

export enum InputStatus {
  Default = 'default',
  Invalid = 'invalid',
}

export interface InputFieldDatalistElement {
  readonly name: string;
  readonly description?: string;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly labelIcon?: IconDefinition;
  readonly inputIcon?: IconDefinition;
  readonly anchor?: string;
  readonly required?: boolean;
  readonly hideOptionalLabel?: boolean;
  readonly helperText?: string;
  readonly status?: InputStatus;
  readonly inputDatalist?: InputFieldDatalistElement[];
  readonly onInputRestore?: React.MouseEventHandler<HTMLButtonElement>;
  readonly onInputClear?: React.MouseEventHandler<HTMLButtonElement>;
  readonly shouldAllowInputRestore?: boolean;
  readonly shouldAllowInputClear?: boolean;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    label,
    labelIcon,
    inputIcon,
    required = false,
    hideOptionalLabel = false,
    helperText = '',
    status = InputStatus.Default,
    inputDatalist = [],
    onInputRestore,
    onInputClear,
    value = '',
    anchor = '',
    className,
    shouldAllowInputClear,
    shouldAllowInputRestore,
    ...inputProps
  } = props;

  const formatedLabelId = label.toLowerCase().replace(' ', '-');
  const inputElementId = `input-${formatedLabelId}`;
  const tagDatalistElementId = `datalist-${formatedLabelId}`;

  return (
    <AppInput
      label={label}
      htmlFor={inputElementId}
      className='input-field'
      required={required}
      inputIcon={inputIcon}
      onInputClear={onInputClear}
      onInputRestore={onInputRestore}
      labelIcon={labelIcon}
      shouldAllowInputClear={shouldAllowInputClear}
      shouldAllowInputRestore={shouldAllowInputRestore}
      helperText={helperText}
    >
      <input
        {...inputProps}
        id={inputElementId}
        list={inputDatalist.length > 0 ? tagDatalistElementId : void 0}
        value={value}
        required={required}
        readOnly={props.readOnly ?? !props.onChange}
      />
      <datalist id={tagDatalistElementId}>
        {inputDatalist.map((element) => (
          <option value={element.name} key={element.name}>{element.description}</option>
        ))}
      </datalist>
      {/* <div className='input-management-actions'>
        { onInputRestore && anchor !== value && anchor !== '' && (
          <button className='action-icon' onClick={onInputRestore} title='Restore input'>
            <FontAwesomeIcon icon={faRotateBack} size='lg' />
          </button>
        )}
        { onInputClear && value && (
          <button className='action-icon' onClick={onInputClear} title='Clear input'>
            <FontAwesomeIcon icon={faXmark} size='xl' />
          </button>
        )}
      </div> */}
    </AppInput>
    // <label
    //   htmlFor={inputElementId}
    //   className={['input-field', className].join(' ')}
    // >
    //   <header>
    //     { labelIcon && <FontAwesomeIcon icon={labelIcon} className='label-icon' /> }
    //     <label>
    //       <span className='field-label'>{label}</span>
    //       { !required && !hideOptionalLabel && (
    //         <>
    //           <span className='optional-field-divider'> - </span>
    //           <span className='optional-field-label'>Optional</span>
    //         </>
    //       )}
    //     </label>
    //   </header>
    //   <section className={["input-bar", status].join(' ')}>
    //     <div className='input-icon-wrapper'>
    //       { inputIcon && <FontAwesomeIcon icon={inputIcon} className='input-icon' /> }
    //     </div>
    //     <input
    //       {...inputProps}
    //       id={inputElementId}
    //       list={inputDatalist.length > 0 ? tagDatalistElementId : void 0}
    //       value={value}
    //       required={required}
    //       readOnly={props.readOnly ?? !props.onChange}
    //     />
    //     <datalist id={tagDatalistElementId}>
    //       {inputDatalist.map((element) => (
    //         <option value={element.name} key={element.name}>{element.description}</option>
    //       ))}
    //     </datalist>
    //     <div className='input-management-actions'>
    //       { onInputRestore && anchor !== value && anchor !== '' && (
    //         <button className='action-icon' onClick={onInputRestore} title='Restore input'>
    //           <FontAwesomeIcon icon={faRotateBack} size='lg' />
    //         </button>
    //       )}
    //       { onInputClear && value && (
    //         <button className='action-icon' onClick={onInputClear} title='Clear input'>
    //           <FontAwesomeIcon icon={faXmark} size='xl' />
    //         </button>
    //       )}
    //     </div>
    //   </section>
    //   { helperText && (
    //     <span className='input-helper-text'>{helperText}</span>
    //   )}
    // </label>
  )
}