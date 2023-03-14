import { faRedo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, FC, useState } from 'react';
import { InputField, InputStatus } from '../../../components/InputField';
import { ProductTagFieldDeclaration } from '../../../models/product-tag-field-declaration.model';
import './product-tag-field-inspection.scss';

export interface ProductTagField {
  name: string;
  required: boolean;
  example: string;
}

export interface ProductTagFieldBundle extends Omit<ProductTagField, 'id'> {
  initialField?: Omit<ProductTagField, 'id'>;
}

export interface ProductTagFieldInspectionState {
  updateField: (field: ProductTagFieldBundle) => void;
  removeField: () => void;
  field: ProductTagFieldBundle;
  fields: ProductTagFieldBundle[];
}

export const ProductTagFieldInspection: FC<ProductTagFieldInspectionState> = (props) => {
  const { field, fields, updateField, removeField } = props;

  const [ fieldNameDescription, setFieldNameDescription ] = useState('');
  const [ fieldNameInputState, setFieldNameInputState ] = useState(InputStatus.Default);

  const [ exampleInputState, setExampleInputState ] = useState(InputStatus.Default);

  const onFieldNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateField({ ...field, name: event.target.value });
  }

  const onRequiredStateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateField({ ...field, required: event.target.checked });
  }

  const onExampleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateField({ ...field, example: event.target.value });
  }
  
  const restoreFieldProperties: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const { initialField } = field;

    if (!initialField) {
      return;
    }

    updateField({
      name: initialField.name,
      example: initialField.example,
      required: initialField.required,
      initialField: initialField,
    });

    setFieldNameInputState(InputStatus.Default);
    setExampleInputState(InputStatus.Default);
  }

  const onFieldNameBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newFieldName = event.target.value;
    setFieldNameDescription('');

    if (newFieldName.length === 0) {
      setFieldNameInputState(InputStatus.Default);
      return;
    }

    const existingLocalTagName = fields.find((localField) => localField.name.toLowerCase() === field.name.trim().toLowerCase() && localField !== field)
    if (existingLocalTagName) {
      setFieldNameInputState(InputStatus.Invalid);
      setFieldNameDescription(`Tag field with the name \`${existingLocalTagName.name}\` already exist`);
      return;
    }

    if (field.initialField?.name === newFieldName) {
      setFieldNameInputState(InputStatus.Default);
      return;
    }
    
    setFieldNameInputState(InputStatus.Valid);
  }

  const onExampleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newExample = event.target.value;
    setFieldNameDescription('');

    if (newExample.length === 0 || field.initialField?.example === newExample) {
      setExampleInputState(InputStatus.Default);
      return;
    }
    
    setExampleInputState(InputStatus.Valid);
  }
  
  return (
    <div className="product-tag-field-inspection">
      <InputField
        name="Field Name"
        status={fieldNameInputState}
        description={fieldNameDescription}
        value={field.name}
        onChange={onFieldNameChange}
        onBlur={onFieldNameBlur}
      />
      <InputField
        name="Format Example"
        status={exampleInputState}
        value={field.example}
        onChange={onExampleChange}
        onBlur={onExampleBlur}
      />
      <div>
        <span>Field is required in product </span>
        <input checked={field.required} type="checkbox" onChange={onRequiredStateChange} />
      </div>
      <div className='field-action-buttons'>
        <button className='field-restore-button' onClick={restoreFieldProperties}><FontAwesomeIcon icon={faRedo} /> Restore</button>
        <button className='field-remove-button' onClick={removeField}><FontAwesomeIcon icon={faTrash} /> Remove</button>
      </div>
    </div>
  )
}