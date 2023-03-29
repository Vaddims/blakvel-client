import { faCheck, faRotateBack, faWarning, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
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
  readonly description?: string;
  readonly status?: InputStatus;
  readonly inputDatalist?: InputFieldDatalistElement[];
  readonly onInputRestore?: () => void;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    label,
    labelIcon,
    required = false,
    description = '',
    status = InputStatus.Default,
    inputDatalist = [],
    onInputRestore,
    value = '',
    className,
    ...inputProps
  } = props;

  const formatedLabelId = label.toLowerCase().replace(' ', '-');
  const inputElementId = `input:${formatedLabelId}`;
  const tagDatalistElementId = `datalist:${formatedLabelId}`;

  return (
    <legend
      className={['input-field', className].join(' ')}
      about={inputElementId}
    >
      <div className='title-bar'>
        {labelIcon && (
          <FontAwesomeIcon icon={labelIcon} />
        )}
        <span>
          {label}
          {required && (
            <span className='required-asterisk'>*</span>
          )}
        </span>
      </div>
      <div className={["input-bar", status].join(' ')}>
        <input
          {...inputProps}
          id={inputElementId}
          list={inputDatalist.length > 0 ? tagDatalistElementId : void 0}
          value={value}
          readOnly={props.readOnly ?? !props.onChange}
        />
        { inputDatalist && (
          <datalist id={tagDatalistElementId}>
            {inputDatalist.map((element) => (
              <option value={element.name} key={element.name}>{element.description}</option>
            ))}
          </datalist>
        ) }
        <div className='ics'>
          {onInputRestore && (
            <button onClick={() => onInputRestore()} title='Restore value'>
              <FontAwesomeIcon icon={faRotateBack} size='lg' />
            </button>
          )}
        </div>
        {renderInputStatusIcon(status)}
      </div>
      <span className='input-description'>{description}</span>
    </legend>
  )
}

const renderInputStatusIcon = (inputStatus: InputStatus) => {
  switch (inputStatus) {
    case InputStatus.Valid:
      return (<FontAwesomeIcon icon={faCheck} className='input-icon valid' color='red' size='lg' />);
    
    case InputStatus.Invalid:
      return (<FontAwesomeIcon icon={faXmark} className='input-icon invalid' size='lg' />);

    case InputStatus.Warn:
      return (<FontAwesomeIcon icon={faWarning} className='input-icon warn' size='lg' />)
  }
}