import { faCheck, faWarning, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './input-field.scss';

export enum InputStatus {
  Default = 'default',
  Valid = 'valid',
  Warn = 'warn',
  Invalid = 'invalid',
}

interface InputFieldProps {
  readonly name: string;
  readonly value: string;
  readonly description?: string;
  readonly className?: string;
  readonly icon?: IconDefinition;
  readonly placeholder?: string;
  readonly status?: InputStatus;
  readonly disabled?: boolean;
  readonly type?: React.HTMLInputTypeAttribute;
  readonly onChange?: React.ChangeEventHandler<HTMLInputElement>;
  readonly onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    name,
    value,
    icon,
    placeholder = '',
    description,
    status = InputStatus.Default,
    disabled = false,
    type = 'text',
    className = '',
    onChange,
    onBlur,
  } = props;

  return (
    <div className={['input-field', className].join(' ')}>
      <div className='title-bar'>
        {icon && (
          <FontAwesomeIcon icon={icon} />
        )}
        <span>{name}</span>
      </div>
      <div className={["input-bar", status].join(' ')}>
        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder} 
          onChange={onChange} 
          onBlur={onBlur}
        />
        {renderInputStatusIcon(status)}
      </div>
      <span className='input-description'>{description}</span>
    </div>
  )
}

const renderInputStatusIcon = (inputStatus: InputStatus) => {
  switch (inputStatus) {
    case InputStatus.Valid:
      return (<FontAwesomeIcon icon={faCheck} className='input-icon valid' color='red' />);
    
    case InputStatus.Invalid:
      return (<FontAwesomeIcon icon={faXmark} className='input-icon invalid' />);

    case InputStatus.Warn:
      return (<FontAwesomeIcon icon={faWarning} className='input-icon warn' />)
  }
}