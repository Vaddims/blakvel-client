import { faEdit, faLink, faRotateLeft, faRotateRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react"
import { useNavigate } from "react-router-dom";
import { InputFieldStatusDescriptor } from "..";
import { InputField } from "../../../components/InputField";
import { Product } from "../../../models/product.model";
import { ProductTagField } from "../../CreateProductTag/ProductTagFieldInspection";
import './product-tag-representer.scss';

interface ProductTagRepresenterProps {
  targetProductTag: Product.Tag;
  draftProductTags: Product.Tag[];
  specifications: Product.Specification[];
  setProductTags: React.Dispatch<React.SetStateAction<Product.Tag[]>>
  updateSpecification: (field: Product.Tag.Field) => React.ChangeEventHandler<HTMLInputElement>;
  blurSpecification: (field: Product.Tag.Field) => React.FocusEventHandler<HTMLInputElement>;
  clickSpecification: (field: Product.Tag.Field) => React.MouseEventHandler<HTMLInputElement>;
  draftProductSpecificationStatusDescriptors: InputFieldStatusDescriptor[];
  restore?: () => void;
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
  } = props;

  const navigate = useNavigate();

  const editTag = () => {
    navigate(`/product-tags/${targetProductTag.id}/inspect`)
  }

  const removeTag = () => {
    const newTags = draftProductTags.filter(pt => pt.id !== targetProductTag.id);
    setProductTags(newTags);  
  }

  const onChange = (field: Product.Tag.Field): React.ChangeEventHandler<HTMLInputElement> => (event) => {
    updateSpecification(field)(event);
  }

  const onBlur = (field: Product.Tag.Field): React.FocusEventHandler<HTMLInputElement> => (event) => {
    blurSpecification(field)(event);
  }

  const onClick = (field: Product.Tag.Field): React.MouseEventHandler<HTMLInputElement> => (event) => {
    clickSpecification(field)(event);
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
              required={field.required}
              label={field.name} 
              value={specifications.find(spec => spec.field.id === field.id)?.value ?? ''} 
              placeholder={`ex. ${field.example}`} 
              onChange={onChange(field)} 
              onBlur={onBlur(field)}
              onClick={onClick(field)}
            />
          ))}
        </div>
      )}
    </div>
  )
}