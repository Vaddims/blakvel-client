import type { FC, HTMLProps } from 'react';
import { ProductTag } from '../../models/product-tag.model';
import "./flat-product-tag-card.scss";

interface FlatProductTagCardProps extends HTMLProps<HTMLElement> {
  productTag: ProductTag;
}

const FlatProductTagCard: FC<FlatProductTagCardProps> = (props) => {
  const { className } = props;
  const { id, name, fieldNames } = props.productTag;

  return (
    <article {...props} className={`flat-product-tag-card ${className}`} title={id}>
      <div className="product-tag-name-box">
        <span className="product-tag-name">{name}</span>
      </div>
      <div className="product-tag-details">
        {fieldNames.length !== 0 && <span>{fieldNames.length} fields</span>}
      </div>
    </article>
  );
}

export default FlatProductTagCard;