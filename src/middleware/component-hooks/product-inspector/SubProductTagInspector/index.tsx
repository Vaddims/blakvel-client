import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputFieldCollection } from "../../../hooks/use-input-field-collection-hook";
import './sub-product-tag-inspector.scss';
import { faEdit, faRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { LocationState } from "../../../../interfaces/location-state.model";
import useSelectInputField, { defaultSelectInputFieldOption } from "../../../hooks/select-input-field-hook";
import { ProductTagDto } from "../../../../dto/product-tag/product-tag.dto";
import { CustomerProductTagDto } from "../../../../dto/product-tag/customer-product-tag.dto";
import { ProductTagFieldDto } from "../../../../dto/product-tag-field/product-tag-field.dto";

export interface SubProductTagInspectorProps<P> {
  readonly productTag: ProductTagDto | CustomerProductTagDto;
  readonly removeProductTag: () => void;
  readonly specificationGroup: InputFieldCollection.FieldGroup<P>;
}

const SubProductTagInspector: React.FC<SubProductTagInspectorProps<ProductTagFieldDto>> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState: LocationState = location.state ?? {};
  const { awaitingPreviousPaths = [] } = locationState;

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

  const s = useSelectInputField({
    label: 'Apply tag to:',
    required: true,
    options: [
      {
        title: 'All currently modifing products',
        value: 'fd',
      },
      {
        title: 'Products with existing tag',
        value: 's',
      }
    ],
    value: defaultSelectInputFieldOption,
    anchor: defaultSelectInputFieldOption,
  })

  return (
    <div className="product-tag-boundary">
      <header>
        <div className='product-tag-manager'>
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
        </div>
        {/* {s.render()} */}
      </header>
      { props.productTag.fields.length > 0 && (
        <div className="product-tag-fields">
          {props.specificationGroup.fields.map((field) => field.render())}
        </div>
      )}
    </div>
  )
}

export default SubProductTagInspector;