import { MouseEventHandler } from 'react';
// import { IProductTag } from "../../../middleware/utils/structure-types/product-tag";
import "./flat-product-tag-card.scss";

interface FlatProductTagCardProps {
  // productTag: IProductTag;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>; 
}

function FlatProductTagCard(props: FlatProductTagCardProps) {
  const { className, onClick } = props;
  // const { publicId, name, fieldNames } = props.productTag;

  return (
    <article className={`flat-product-tag-card ${className}`} onClick={onClick}>
      {/* <div className="product-tag-name-box">
        <span className="product-tag-name">{name}</span>
      </div>
      <div className="product-tag-details">
        {fieldNames.length !== 0 && <span>{fieldNames.length} fields</span>}
      </div> */}
    </article>
  );
}

export default FlatProductTagCard;