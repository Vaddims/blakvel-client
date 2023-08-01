import { faEdit, faLink, faRotateLeft, faRotateRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { InputFieldStatusDescriptor } from "..";
import InputField from "../../../components/TextInputField";
// import './product-tag-representer.scss';
import { LocationState } from "../../../interfaces/location-state.model";
import { ProductTagDto } from "../../../dto/product-tag/product-tag.dto";
import { ProductSpecificationDto } from "../../../dto/product-specification/product-specification.dto";
import { ProductTagFieldDto } from "../../../dto/product-tag-field/product-tag-field.dto";

interface ProductTagRepresenterProps {
  targetProductTag: ProductTagDto;
  draftProductTags: ProductTagDto[];
  specifications: ProductSpecificationDto[];
  setProductTags: React.Dispatch<React.SetStateAction<ProductTagDto[]>>
  updateSpecification: (field: ProductTagFieldDto) => React.ChangeEventHandler<HTMLInputElement>;
  blurSpecification: (field: ProductTagFieldDto) => React.FocusEventHandler<HTMLInputElement>;
  clickSpecification: (field: ProductTagFieldDto) => React.MouseEventHandler<HTMLInputElement>;
  draftProductSpecificationStatusDescriptors: InputFieldStatusDescriptor[];
  restore?: () => void;
  restoreSpecification?: (specFieldId: string) => void;
  clearSpecification?: (specFieldId: string) => void
  getProductSpecificationInitialState: (specFieldId: string) => ProductSpecificationDto | undefined; 
}

export const ProductTagRepresenter: FC<ProductTagRepresenterProps> = (props) => {
  const {
    targetProductTag,
    draftProductTags,
    specifications,
    draftProductSpecificationStatusDescriptors,
    setProductTags,
    updateSpecification,
    blurSpecification,
    clickSpecification,
    restore,
    restoreSpecification,
    clearSpecification,
    getProductSpecificationInitialState
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const locationState: LocationState = location.state ?? {};
  const { awaitingPreviousPaths = [] } = locationState;

  const editTag = () => {
    const newAwaitingPreviousPaths = [...awaitingPreviousPaths, location.pathname];
    navigate(`/product-tags/${targetProductTag.id}/inspect`, {
      state: {
        ...locationState,
        awaitingPreviousPaths: newAwaitingPreviousPaths,
      },

    });
  }

  const removeTag = () => {
    const newTags = draftProductTags.filter(pt => pt.id !== targetProductTag.id);
    setProductTags(newTags);  
  }

  const onChange = (field: ProductTagFieldDto): React.ChangeEventHandler<HTMLInputElement> => (event) => {
    updateSpecification(field)(event);
  }

  const onBlur = (field: ProductTagFieldDto): React.FocusEventHandler<HTMLInputElement> => (event) => {
    blurSpecification(field)(event);
  }

  const onClick = (field: ProductTagFieldDto): React.MouseEventHandler<HTMLInputElement> => (event) => {
    clickSpecification(field)(event);
  }

  const onRestore = (field: ProductTagFieldDto): React.MouseEventHandler<HTMLButtonElement> => () => {
    restoreSpecification?.(field.id);
  }

  const onClear = (field: ProductTagFieldDto): React.MouseEventHandler<HTMLButtonElement> => () => {
    clearSpecification?.(field.id);
  }

  return (
    <div className="product-tag-boundary">
      <header>
        <span className="product-tag-name">{targetProductTag.name}</span>
        <div className='product-tag-management'>
          <button title='Edit tag' onClick={editTag}>
            <FontAwesomeIcon icon={faEdit} size={"lg"} />
          </button>
          {targetProductTag.fields.length > 0 && (
            <button title='Restore fields' onClick={restore}>
              <FontAwesomeIcon icon={faRotateLeft} size={'lg'} />
            </button>
          )}
          <button title='Remove tag' onClick={removeTag}>
            <FontAwesomeIcon icon={faTrash} size={"lg"} />
          </button>
        </div>
      </header>
      {targetProductTag.fields.length > 0 && (
        <div className="product-tag-fields">
          {targetProductTag.fields.map(field => (
            <InputField
              key={field.id}
              status={draftProductSpecificationStatusDescriptors.find(spec => spec.fieldId === field.id)?.status}
              helperText={draftProductSpecificationStatusDescriptors.find(spec => spec.fieldId === field.id)?.description}
              markAsRequired={field.required}
              label={field.name} 
              value={specifications.find(spec => spec.field.id === field.id)?.value ?? ''} 
              placeholder={`ex. ${field.example}`} 
              onChange={onChange(field)} 
              onBlur={onBlur(field)}
              onClick={onClick(field)}
              onInputRestore={onRestore(field)}
              onInputClear={onClear(field)}
            />
          ))}
        </div>
      )}
    </div>
  )
}