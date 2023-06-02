import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextInputField from "../../../../components/TextInputField";
import { Product } from "../../../../models/product.model";
import { InputField } from "../../../hooks/input-field-hook";
import { InputFieldCollection } from "../../../hooks/use-input-field-collection-hook";
import './sub-product-tag-inspector.scss';
import { faEdit, faRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { LocationState } from "../../../../models/location-state.model";

export interface SubProductTagInspectorProps<P> {
  readonly productTag: Product.Tag;
  readonly removeProductTag: () => void;
  readonly specificationGroup: InputFieldCollection.FieldGroup<P>;
}

const SubProductTagInspector: React.FC<SubProductTagInspectorProps<Product.Tag.Field>> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState: LocationState = location.state ?? {};
  const { awaitingPreviousPaths = [] } = locationState;

  const renderField = (tagField: Product.Tag.Field) => {
    // console.log('income', tagField, 'from', props.specificationGroup.fields)
    const field = props.specificationGroup.fields.find(field => field.payload.id === tagField.id);

    if (!field) {
      return (
        <div>Field not found</div>
      )
    }

    switch (field.fieldType) {
      case InputFieldCollection.FieldType.Text:
        return (
          <TextInputField
            label={field.label}
            value={field.value}
            markAsRequired={field.required}
            placeholder={field.placeholder}
            onChange={(e) => field.modify({
              value: e.target.value,
            })}
            onInputRestore={field.value !== field.anchor && field.anchor !== '' && (() => {
              field.modify({
                value: field.anchor,
              })
            })}
            onInputClear={field.value !== '' && (() => {
              field.modify({
                value: '',
              })
            })}
            onClick={() => {
              field.statusApplier.restoreDefault();
            }}
            onFocus={() => {
              field.handleFocus();
            }}
            onUnbound={() => {
              field.handleUnbound();
            }}
            status={field.status}
            helperText={field.helperText}
          />
        );
    }

    return (
      <div>End</div>
    )
  }

  const editTag = () => {
    const newAwaitingPreviousPaths = [...awaitingPreviousPaths, location.pathname];
    navigate(`/product-tags/${props.productTag.id}/inspect`, {
      state: {
        ...locationState,
        awaitingPreviousPaths: newAwaitingPreviousPaths,
      },
    });
  }

  const restoreInputs = () => {
    props.specificationGroup.restore();
  }

  const removeTag = () => {
    props.removeProductTag();
  }

  return (
    <div className="product-tag-boundary">
      <header>
        <span className="product-tag-name">{props.productTag.name}</span>
        <div className='product-tag-management'>
          <button title='Edit tag' onClick={editTag}>
            <FontAwesomeIcon icon={faEdit} size={"lg"} />
          </button>
          {props.specificationGroup.fields.length > 0 && (
            <button title='Restore fields' onClick={restoreInputs}>
              <FontAwesomeIcon icon={faRotateLeft} size={'lg'} />
            </button>
          )}
          <button title='Remove tag' onClick={removeTag}>
            <FontAwesomeIcon icon={faTrash} size={"lg"} />
          </button>
        </div>
      </header>
      { props.productTag.fields.length > 0 && (
        <div className="product-tag-fields">
          {props.productTag.fields.map(renderField)}
        </div>
      )}
    </div>
  )
}

export default SubProductTagInspector;