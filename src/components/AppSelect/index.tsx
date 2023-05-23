import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './app-select.scss';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { InputStatus } from '../InputField';
import AppInput from '../AppInput';

interface AppSelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  readonly label: string;
  readonly labelIcon?: IconDefinition;
  readonly inputIcon?: IconDefinition;
  readonly anchor?: string;
  readonly required?: boolean;
  readonly hideOptionalLabel?: boolean;
  readonly helperText?: string;
  readonly status?: InputStatus;
  readonly onInputRestore?: React.MouseEventHandler<HTMLButtonElement>;
  readonly onInputClear?: React.MouseEventHandler<HTMLButtonElement>;
  readonly shouldAllowInputRestore?: boolean;
  readonly shouldAllowInputClear?: boolean;
}

const AppSelect: React.FC<AppSelectProps> = (props) => {
  const {
    label,
    labelIcon,
    required,
    hideOptionalLabel,
    children,
    onInputClear,
    onInputRestore,
    shouldAllowInputClear,
    shouldAllowInputRestore,
    ...selectProps
  } = props;

  return (
    <AppInput
      className='app-select-input'
      label={label}
      required={required}
      labelIcon={labelIcon}
      hideOptionalLabel={hideOptionalLabel}
      shouldAllowInputClear={!required && shouldAllowInputClear}
      shouldAllowInputRestore={shouldAllowInputRestore}
      onInputClear={onInputClear}
      onInputRestore={onInputRestore}
    >
      <select {...selectProps}>
        { children }
      </select>
    </AppInput>
  )
}

export default AppSelect;