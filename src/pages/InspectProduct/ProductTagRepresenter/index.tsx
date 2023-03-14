import { FC } from "react"
import { ProductSpecificationField } from "..";
import { ProductTag } from "../../../models/product-tag.model";
import './product-tag-representer.scss';

interface ProductTagRepresenterProps {
  productTag: ProductTag;
  setSpecificationFields: React.Dispatch<React.SetStateAction<ProductSpecificationField[]>>;
}

export const ProductTagRepresenter: FC<ProductTagRepresenterProps> = (props) => {
  const { id, name, fields } = props.productTag;

  return (
    <div className="product-tag-boundary">
      <span className="product-tag-name">{name}</span>
      <div className="product-tag-field-cluster">
        {fields.map(field => (
          <div className="product-tag-field">
            <span>{field.name}{field.required ? '*' : ''}</span>
            <input type="text" value={field.value} placeholder={`ex. ${field.example}`} />
          </div>
        ))}
      </div>
    </div>
  )
}