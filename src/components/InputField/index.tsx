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
    value = '',
    anchor = '',
    className,
    ...inputProps
  } = props;

  const formatedLabelId = label.toLowerCase().replace(' ', '-');
  const inputElementId = `input-${formatedLabelId}`;
  const tagDatalistElementId = `datalist-${formatedLabelId}`;

  const shouldDisplayValueRestoreButton = !!onInputRestore && value !== anchor;

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
        { inputIcon && <FontAwesomeIcon icon={inputIcon} className='input-icon' /> }
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
          {shouldDisplayValueRestoreButton && (
            <button onClick={onInputRestore} title='Restore initial value'>
              { anchor === '' ? (
                <FontAwesomeIcon icon={faXmark} size='xl' />
              ) : (
                <FontAwesomeIcon icon={faRotateBack} size='lg' />
              ) }
            </button>
          )}
        </div>
      </section>
      <span className='input-helper-text'>{helperText}</span>
    </label>
  )
}