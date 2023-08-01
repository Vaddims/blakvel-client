import { faRedo, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, FC, useState } from 'react';
import TextInputField from '../../../components/TextInputField';
import './product-tag-field-inspection.scss';
import useCheckboxField from '../../../middleware/hooks/checkbox-field-hook';
import { InputField } from '../../../middleware/hooks/input-field-hook';
import { ProductTagFieldDto } from '../../../dto/product-tag-field/product-tag-field.dto';

export interface ProductTagFieldBundle extends Omit<ProductTagFieldDto, 'id'> {
  initialField?: Omit<ProductTagFieldDto, 'id'>;
}

export interface ProductTagFieldInspectionState {
  updateField: (field: ProductTagFieldBundle) => void;
  removeField: () => void;
  field: ProductTagFieldBundle;
  fields: ProductTagFieldBundle[];
}

export const ProductTagFieldInspection: FC<ProductTagFieldInspectionState> = (props) => {
  const { field, fields, updateField, removeField } = props;

  const requiredFieldCheckbox = useCheckboxField({
    label: 'Required',
    value: field.required,
    onChange(checked) {
      updateField({ ...field, required: checked });
    },
  });

  const [ fieldNameHelperText, setFieldNameHelperText ] = useState('');
  const [ fieldNameInputState, setFieldNameInputState ] = useState(InputField.Status.Default);

  const [ exampleInputState, setExampleInputState ] = useState(InputField.Status.Default);

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

    setFieldNameInputState(InputField.Status.Default);
    setExampleInputState(InputField.Status.Default);
  }

  const onFieldNameBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newFieldName = event.target.value;
    setFieldNameHelperText('');

    if (newFieldName.length === 0) {
      setFieldNameInputState(InputField.Status.Default);
      return;
    }

    const existingLocalTagName = fields.find((localField) => localField.name.toLowerCase() === field.name.trim().toLowerCase() && localField !== field)
    if (existingLocalTagName) {
      setFieldNameInputState(InputField.Status.Error);
      setFieldNameHelperText(`Tag field with the name \`${existingLocalTagName.name}\` already exist`);
      return;
    }

    if (field.initialField?.name === newFieldName) {
      setFieldNameInputState(InputField.Status.Default);
      return;
    }
    
    setFieldNameInputState(InputField.Status.Default);
  }

  const onExampleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newExample = event.target.value;
    setFieldNameHelperText('');

    if (newExample.length === 0 || field.initialField?.example === newExample) {
      setExampleInputState(InputField.Status.Default);
      return;
    }
    
    setExampleInputState(InputField.Status.Default);
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
      <TextInputField
        label="Field Name"
        status={fieldNameInputState}
        helperText={fieldNameHelperText}
        value={field.name}
        onChange={onFieldNameChange}
        onBlur={onFieldNameBlur}
      />
      <TextInputField
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