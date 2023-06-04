import { faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputFieldCollection } from '../../../hooks/use-input-field-collection-hook';
import { ProductTagFieldDescriptor } from '../useProductTagInspector';
import { Product } from '../../../../models/product.model';
import './product-tag-field-inspector.scss';

export interface ProductTagFieldInspectionState {
  readonly inputFieldCollection: InputFieldCollection;
  readonly fieldDescriptor: ProductTagFieldDescriptor;
  readonly linkField?: Product.Tag.Field;
  readonly exchangeFieldPositions: (fieldId1: string, fieldId2: string) => void
  readonly update: (inputs?: Partial<ProductTagFieldDescriptor>, tagField?: Product.Tag.Field) => void;
  readonly remove: () => void;
}

export const ProductTagFieldInspector: React.FC<ProductTagFieldInspectionState> = (props) => {
  const dragStartHandler: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.setData(`taglocalid/${props.fieldDescriptor.localUid}`, props.fieldDescriptor.localUid);
  }

  const dragDropHandler: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.currentTarget.classList.remove('drag-zone-hover');
    const tagLocalId = event.dataTransfer.types.find(type => type.includes('taglocalid'))?.split('/')[1];
    event.dataTransfer.clearData()
    if (!tagLocalId) {
      return;
    }

    props.exchangeFieldPositions(fieldDescriptor.localUid, tagLocalId)
  }

  const dragOverHandler: React.DragEventHandler = (event) => {
    event.preventDefault();
    const tagLocalId = event.dataTransfer.types.find(type => type.includes('taglocalid'))?.split('/')[1];
    if (!tagLocalId) {
      return;
    }

    if (fieldDescriptor.localUid === tagLocalId) {
      return;
    }

    event.currentTarget.classList.add('drag-zone-hover');
  }

  const dragLeaveHandler: React.DragEventHandler = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-zone-hover');
  }

  const {
    inputFieldCollection,
    fieldDescriptor,
  } = props;

  const fieldGroup = inputFieldCollection.createFieldGroup(fieldDescriptor.localUid);

  const relinkWithField = () => {
    if (!props.linkField || fieldGroup.fields.length === 0) {
      return;
    }

    const name = fieldGroup.fields[0]?.value as string;
    const example = fieldGroup.fields[1]?.value as string;
    const required = fieldGroup.fields[2]?.value as boolean;

    if ([name, example, required].some(element => typeof element === 'undefined')) {
      throw new Error('Invalid field group structure');
    } 

    props.update({
      example: example || props.linkField.example,
      required: required || props.linkField.required,
    }, props.linkField)
  }

  if (fieldGroup.fields.length === 0) { // Prevent ui "jumping" beacause of no data
    return (
      <></>
    );
  }

  return (
    <div 
      className="product-tag-field-inspector" 
      onDragLeave={dragLeaveHandler} 
      onDragOver={dragOverHandler} 
      onDragStart={dragStartHandler} 
      onDrop={dragDropHandler} 
      draggable
    >
      <header>
        <span className='field-inspector-headertext'>
          {props.fieldDescriptor.id ? `Field` : 'New Field'}
        </span>
        <div className='product-tag-field-management'>
          {(
            <button title='Restore field' onClick={() => fieldGroup.restore()}>
              <FontAwesomeIcon icon={faRotateLeft} size={'lg'} />
            </button>
          )}
          <button title='Remove tag' onClick={props.remove}>
            <FontAwesomeIcon icon={faTrash} size={"lg"} />
          </button>
        </div>
      </header>
        {fieldGroup.fields.map(field => field.render())}
      { props.linkField && (
        <div className='product-tag-field-match'>
          <span>The name of the field matches with a previously existing field</span>
          <button onClick={relinkWithField}>Restore field</button>
        </div>
      ) }
    </div>
  )
}
