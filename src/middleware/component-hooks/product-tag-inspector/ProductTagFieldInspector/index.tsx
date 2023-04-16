import * as uuid from 'uuid';
import { faRedo, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, FC, useState } from 'react';
import './product-tag-field-inspector.scss';
import { useCheckboxFieldManagement } from '../../../hooks/useCheckboxFieldManagement';
import { Product } from '../../../../models/product.model';
import { InputField, InputStatus } from '../../../../components/InputField';
import { ProductTagFieldState } from '../useProductTagInspector';
import { InputFieldCollectionManagement } from '../../../hooks/useInputFieldCollectionManagement';

export interface ProductTagFieldInspectionState {
  index: number;
  updateField: (field: ProductTagFieldState, inputFieldId: string) => void;
  removeField: () => void;
  exchangeFieldPosition: any;
  canRelinkWith?: ProductTagFieldState;
  fieldState: ProductTagFieldState;
  inputFieldCollectionManagement: InputFieldCollectionManagement<string, string>;
}

const createFieldUid = (field: ProductTagFieldState, inputFieldName: string) => {
  return `${field.localId}/${inputFieldName}`;
}

export const ProductTagFieldInspector: FC<ProductTagFieldInspectionState> = (props) => {
  const { 
    index,
    canRelinkWith,
    fieldState,
    exchangeFieldPosition,
    updateField, 
    removeField,
    inputFieldCollectionManagement,
  } = props;

  const requiredFieldCheckbox = useCheckboxFieldManagement({
    label: 'Require field to be filled in',
    initialyChecked: fieldState.current.required,
    onChange(checked) {
      const inputFieldId = createFieldUid(fieldState, 'required');
      updateField(getNewChangedFieldState(fieldState, 'required', checked), inputFieldId);
    },
  });

  // const [ fieldNameHelperText, setFieldNameHelperText ] = useState('');
  // const [ fieldNameInputState, setFieldNameInputState ] = useState(InputStatus.Default);

  // const [ exampleInputState, setExampleInputState ] = useState(InputStatus.Default);

  function getNewChangedFieldState<T extends keyof ProductTagFieldState['current']>(
    fieldState: ProductTagFieldState, 
    key: T, 
    value: ProductTagFieldState['current'][T]
  ): ProductTagFieldState {
    return {
      ...fieldState,
      current: {
        ...fieldState.current,
        [key]: value,
      }
    }
  }

  const nameChangeHanlder: ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputFieldId = createFieldUid(fieldState, 'name');
    updateField(getNewChangedFieldState(fieldState, 'name', event.target.value), inputFieldId);
  }

  const exampleChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputFieldId  = createFieldUid(fieldState, 'example');
    updateField(getNewChangedFieldState(fieldState, 'example', event.target.value), inputFieldId);
  }
  
  const restoreFieldProperties: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const { initial } = fieldState;

    if (!initial) {
      return;
    }

    updateField({
      ...fieldState,
      current: {
        ...initial,
      }
    }, '');
  }

  const restorePreviousFieldProperties: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!canRelinkWith) {
      return;
    }

    updateField({
      ...canRelinkWith
    }, '');
  }

  const fieldNameBlurHandler: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newFieldName = event.target.value;

    try {
      inputFieldCollectionManagement.validateValue(createFieldUid(fieldState, 'name'), newFieldName);
    } catch {}
  }

  const fieldExampleBlurHandler: React.FocusEventHandler<HTMLInputElement> = (event) => {

  }

  const dragStartHandler: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData(`index/${index}`, index.toString());
  }

  const dragDropHandler: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.currentTarget.classList.remove('drag-zone-hover');
    const num = event.dataTransfer.types.find(type => type.includes('index'))?.split('/')[1];
    event.dataTransfer.clearData()
    if (!num) {
      return;
    }

    const draggedIndex = Number(num)
    exchangeFieldPosition(index, draggedIndex);
  }

  const dragOverHandler: React.DragEventHandler = (event) => {
    event.preventDefault();
    const num = event.dataTransfer.types.find(type => type.includes('index'))?.split('/')[1];
    if (!num) {
      return;
    }

    const draggedIndex = Number(num)
    if (draggedIndex === index) {
      return;
    }

    event.currentTarget.classList.add('drag-zone-hover');
  }

  const dragLeaveHandler: React.DragEventHandler = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-zone-hover');
  }

  const nameInputId = createFieldUid(fieldState, 'name');
  const exampleId = createFieldUid(fieldState, 'example');
  const nameDescriptor = inputFieldCollectionManagement.findDescriptor(nameInputId);
  const exampleDescriptor = inputFieldCollectionManagement.findDescriptor(exampleId);

  return (
    <div className="product-tag-field-inspector" onDragLeave={dragLeaveHandler} onDragOver={dragOverHandler} onDragStart={dragStartHandler} onDrop={dragDropHandler} draggable>
      <header>
        <span className='field-inspector-headertext'>
          {fieldState.current.id ? `Field` : 'New Field'}
        </span>
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
        label="Display Name"
        status={nameDescriptor?.status}
        helperText={nameDescriptor?.helperText}
        value={fieldState.current.name}
        onChange={nameChangeHanlder}
        onBlur={fieldNameBlurHandler}
        onClick={inputFieldCollectionManagement.onInputClick(nameInputId)}
        required
      />
      <InputField
        label="Format Example"
        status={exampleDescriptor?.status}
        helperText={exampleDescriptor?.helperText ?? 'The format example will be shown only in product inspection mode.'}
        value={fieldState.current.example}
        onChange={exampleChangeHandler}
        onBlur={fieldExampleBlurHandler}
        onClick={inputFieldCollectionManagement.onInputClick(exampleId)}
      />
      { requiredFieldCheckbox.render() }
      { canRelinkWith && (
        <div className='product-tag-field-match'>
          <span>The name of the field matches with a previously existing field</span>
          <button onClick={restorePreviousFieldProperties}>Restore field</button>
        </div>
      ) }
    </div>
  )
}