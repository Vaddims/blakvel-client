import { ChangeEventHandler } from "react";

interface ImageAdderLabelProps {
  multiple?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const ImageAdderLabel: React.FC<ImageAdderLabelProps> = (props) => {
  const { multiple, onChange } = props;

  return (
    <label className='media-add' about='file-adder'>
      <input type="file" id='file-adder' onChange={onChange} multiple={multiple} title=' ' />
      <h1 className="media-add-icon">+</h1>
    </label>
  );
}

export default ImageAdderLabel;