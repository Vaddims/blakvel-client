import InputField, { InputFieldCommonProps, extractInputFieldProps } from "../InputField";
import './textarea-input-field.scss';

interface AppTextareaInputFieldProps extends InputFieldCommonProps, React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {}

const TextareaField: React.FC<AppTextareaInputFieldProps> = (props) => {
  return (
    <InputField
      {...extractInputFieldProps(props)}
      className="textarea-input-field"
    >
      <textarea {...props} />
    </InputField>
  )
}

export default TextareaField;