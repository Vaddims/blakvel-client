import { faRedo, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, FC, useState } from 'react';
import { InputField, InputStatus } from '../../../components/InputField';
import { Product } from '../../../models/product.model';
import './product-tag-field-inspection.scss';
import { useCheckboxFieldManagement } from '../../../middleware/hooks/useCheckboxFieldManagement';

export interface ProductTagFieldBundle extends Omit<Product.Tag.Field, 'id'> {
  initialField?: Omit<Product.Tag.Field, 'id'>;
}

export interface ProductTagFieldInspectionState {
  updateField: (field: ProductTagFieldBundle) => void;
  removeField: () => void;
  field: ProductTagFieldBundle;
  fields: ProductTagFieldBundle[];
}

export const ProductTagFieldInspection: FC<ProductTagFieldInspectionState> = (props) => {
  const { field, fields, updateField, removeField } = props;

  const requiredFieldCheckbox = useCheckboxFieldManagement({
    label: 'Required',
    initialyChecked: field.required,
    onChange(checked) {
      updateField({ ...field, required: checked });
    },
  });

  const [ fieldNameHelperText, setFieldNameHelperText ] = useState('');
  const [ fieldNameInputState, setFieldNameInputState ] = useState(InputStatus.Default);

  const [ exampleInputState, setExampleInputState ] = useState(InputStatus.Default);

  const onFieldNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    updateField({ ...field, name: event.target.value });
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
    setFieldNameHelperText('');

    if (newFieldName.length === 0) {
      setFieldNameInputState(InputStatus.Default);
      return;
    }

    const existingLocalTagName = fields.find((localField) => localField.name.toLowerCase() === field.name.trim().toLowerCase() && localField !== field)
    if (existingLocalTagName) {
      setFieldNameInputState(InputStatus.Invalid);
      setFieldNameHelperText(`Tag field with the name \`${existingLocalTagName.name}\` already exist`);
      return;
    }

    if (field.initialField?.name === newFieldName) {
      setFieldNameInputState(InputStatus.Default);
      return;
    }
    
    setFieldNameInputState(InputStatus.Default);
  }

  const onExampleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newExample = event.target.value;
    setFieldNameHelperText('');

    if (newExample.length === 0 || field.initialField?.example === newExample) {
      setExampleInputState(InputStatus.Default);
      return;
    }
    
    setExampleInputState(InputStatus.Default);
  }
  
  return (
    <div className="product-tag-field-inspection">
      <header>
        <span>Field</span>
        <div className='product-tag-field-management'>
          {(
            <button title='Restore field' onClick={restoreFieldProperties}>
              <FontAwesomeIcon icon={faRotateLeft} size={'lg'} />
            </button>
          )}
          <button title='Remove tag' onClick={removeField}>
            <FontAwesomeIcon icon={faTrash} size={"lg"} />
          </button>
        </div>
      </header>
      <InputField
        label="Field Name"
        status={fieldNameInputState}
        helperText={fieldNameHelperText}
        value={field.name}
        onChange={onFieldNameChange}
        onBlur={onFieldNameBlur}
      />
      <InputField
        label="Format Example"
        status={exampleInputState}
        value={field.example}
        onChange={onExampleChange}
        onBlur={onExampleBlur}
      />
      { requiredFieldCheckbox.render() }
      {/* <div>
        <span>Field is required in product </span>
        <input checked={field.required} type="checkbox" onChange={onRequiredStateChange} />
      </div> */}
      {/* <div className='field-action-buttons'>
        <button className='field-restore-button' onClick={restoreFieldProperties}><FontAwesomeIcon icon={faRedo} /> Restore</button>
        <button className='field-remove-button' onClick={removeField}><FontAwesomeIcon icon={faTrash} /> Remove</button>
      </div> */}
    </div>
  )
}