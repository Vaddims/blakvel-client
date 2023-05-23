import { faCheck, faRotateBack, faUserXmark, faWarning, faXmark, faXmarkCircle, faXRay, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import './app-input.scss';

export enum InputStatus {
  Default = 'default',
  Invalid = 'invalid',
}

export interface AppInputProps extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  readonly label: string;
  readonly labelIcon?: IconDefinition;
  readonly inputIcon?: IconDefinition;
  readonly required?: boolean;
  readonly hideOptionalLabel?: boolean;
  readonly helperText?: string;
  readonly status?: InputStatus;
  readonly anchor?: string;
  readonly onInputRestore?: React.MouseEventHandler<HTMLButtonElement>;
  readonly onInputClear?: React.MouseEventHandler<HTMLButtonElement>;
  readonly shouldAllowInputRestore?: boolean;
  readonly shouldAllowInputClear?: boolean;
}

export const AppInput: React.FC<AppInputProps> = (props) => {
  const {
    label,
    labelIcon,
    inputIcon,
    required = false,
    hideOptionalLabel = false,
    helperText = '',
    status = InputStatus.Default,
    className,
    onInputRestore,
    onInputClear,
    anchor,
    children,
    shouldAllowInputClear,
    shouldAllowInputRestore,
  } = props;

  const formatedLabelId = label.toLowerCase().replace(' ', '-');
  const inputElementId = `input-${formatedLabelId}`;

  return (
    <label
      htmlFor={inputElementId}
      className={['app-input', className].join(' ')}
    >
      <header>
        { labelIcon && <FontAwesomeIcon icon={labelIcon} className='label-icon' /> }
        <label>
          <span className='label-title'>{label}</span>
          { !required && !hideOptionalLabel && (
            <>
              <span className='optional-divider'> - </span>
              <span className='optional-label'>Optional</span>
            </>
          )}
        </label>
      </header>
      <section className={["input-section", status].join(' ')}>
        <div className='input-icon-wrapper'>
          { inputIcon && <FontAwesomeIcon icon={inputIcon} className='input-icon' /> }
        </div>
        { children }
        <div className='input-management-actions'>
          { onInputRestore && shouldAllowInputRestore && anchor !== '' && (
            <button className='action-icon' onClick={onInputRestore} title='Restore input'>
              <FontAwesomeIcon icon={faRotateBack} size='lg' />
            </button>
          )}
          { onInputClear && shouldAllowInputClear && (
            <button className='action-icon' onClick={onInputClear} title='Clear input'>
              <FontAwesomeIcon icon={faXmark} size='xl' />
            </button>
          )}
        </div>
        {/* <div className='input-icon-wrapper'>
          { inputIcon && <FontAwesomeIcon icon={inputIcon} className='input-icon' /> }
        </div> */}


        {/* <input
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
        </datalist> */}


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
      </section>
      { helperText && (
        <span className='helper-text'>{helperText}</span>
      )}
    </label>
  )
}

export default AppInput;