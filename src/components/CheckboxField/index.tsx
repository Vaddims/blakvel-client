import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './checkbox-field.scss';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface CheckboxFieldProps {
  readonly checked?: boolean;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
  const {
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
      <span>Discount</span>
    </label>
  )
}