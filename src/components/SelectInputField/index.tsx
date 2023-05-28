import AppInputField, { InputFieldCommonProps, extractInputFieldProps } from '../InputField';
import './select-input-field.scss';

interface AppSelectInputFieldProps extends InputFieldCommonProps, React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {}

const AppSelectInput: React.FC<AppSelectInputFieldProps> = (props) => {
  return (
    <AppInputField
      className='select-input-field'
      {...extractInputFieldProps(props)}
    >
      <select {...props}>
        { props.children }
      </select>
    </AppInputField>
  )
}

export default AppSelectInput;