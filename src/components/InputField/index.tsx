import { faCheck, faRotateBack, faUserXmark, faWarning, faXmark, faXmarkCircle, faXRay, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './input-field.scss';

export enum InputStatus {
  Default = 'default',
  Valid = 'valid',
  Warn = 'warn',
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
  readonly helperText?: string;
  readonly status?: InputStatus;
  readonly inputDatalist?: InputFieldDatalistElement[];
  readonly onInputRestore?: React.MouseEventHandler<HTMLButtonElement>;
  readonly onInputClear?: React.MouseEventHandler<HTMLButtonElement>;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    label,
    labelIcon,
    inputIcon,
    required = false,
    helperText = '',
    status = InputStatus.Default,
    inputDatalist = [],
    onInputRestore,
    onInputClear,
    value = '',
    anchor = '',
    className,
    ...inputProps
  } = props;

  const formatedLabelId = label.toLowerCase().replace(' ', '-');
  const inputElementId = `input-${formatedLabelId}`;
  const tagDatalistElementId = `datalist-${formatedLabelId}`;

  return (
    <label
      htmlFor={inputElementId}
      className={['input-field', className].join(' ')}
    >
      <header>
        { labelIcon && <FontAwesomeIcon icon={labelIcon} /> }
        <label>{label}{ required && <span className='required-asterisk'>*</span> }</label>
      </header>
      <section className={["input-bar", status].join(' ')}>
        <div className='input-icon-wrapper'>
          { inputIcon && <FontAwesomeIcon icon={inputIcon} className='input-icon' /> }
        </div>
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
        <div className='input-management-actions'>
          { onInputRestore && anchor !== value && (
            <button onClick={onInputRestore} title='Restore input'>
              <FontAwesomeIcon icon={faRotateBack} size='lg' />
            </button>
          )}
          { onInputClear && value && (
            <button onClick={onInputClear} title='Clear input'>
              <FontAwesomeIcon icon={faXmark} size='xl' />
            </button>
          )}
        </div>
      </section>
      <span className='input-helper-text'>{helperText}</span>
    </label>
  )
}