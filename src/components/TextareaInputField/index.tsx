import AppInput, { InputFieldCommonProps, extractInputFieldProps } from "../InputField";
import './textarea-input-field.scss';

interface AppTextareaInputFieldProps extends InputFieldCommonProps, React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {}

const AppTextarea: React.FC<AppTextareaInputFieldProps> = (props) => {
  return (
    <AppInput
      {...extractInputFieldProps(props)}
      className="textarea-input-field"
    >
      <textarea {...props} />
    </AppInput>
  )
}

export default AppTextarea;