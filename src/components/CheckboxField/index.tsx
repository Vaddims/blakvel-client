import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './checkbox-field.scss';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface CheckboxFieldProps {
  readonly label?: string;
  readonly checked?: boolean;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
  const {
    label,
    checked = false,
    onClick,
  } = props;

  const fieldIdNumber = ((Math.random() * 10) ** 10).toFixed(0);
  const fieldId = `CHECKBOX-${fieldIdNumber}`;

  return (
    <label htmlFor={fieldId} className={['checkbox-field'].join(' ')}>
      <button id={fieldId} className='checkbox' data-checked={checked} onClick={onClick}>
        <FontAwesomeIcon icon={faCheck} size='lg' className='checkbox-icon' />
      </button>
      { label && (
        <span className='label'>{ label }</span>
      ) }
    </label>
  )
}