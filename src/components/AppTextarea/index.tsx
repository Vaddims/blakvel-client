import AppInput, { AppInputProps } from "../AppInput";
import './app-textarea.scss';

interface AppTextareaProps extends AppInputProps {
  readonly value?: string;
  readonly onInputChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const AppTextarea: React.FC<AppTextareaProps> = (props) => {
  const {
    value = '',
    className,
    onInputChange,
  } = props;

  return (
    <AppInput
      {...props}
      className={["app-textarea-input", className].join(' ')}
    >
      <textarea onChange={onInputChange} value={value} />
    </AppInput>
  )
}

export default AppTextarea;