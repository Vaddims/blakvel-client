import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      {/* <FontAwesomeIcon icon={faPlus} className="media-add-icon" /> */}
    </label>
  );
}

export default ImageAdderLabel;