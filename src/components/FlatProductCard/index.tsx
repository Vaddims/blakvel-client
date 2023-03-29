import { Product } from '../../models/product.model';
import "./flat-product-card.scss";

interface FlatProductCardProps extends React.HTMLAttributes<HTMLElement> {
  product: Product;
}

const FlatProductCard: React.FC<FlatProductCardProps> = (props) => {
  const { className } = props;
  const { id, name, price, discountPrice } = props.product;

  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? (100 - Math.round(discountPrice / price  * 100)) : 0;
  const currentPrice = hasDiscount ? discountPrice : price;

  return (
    <article {...props} className={`flat-product-card ${className}`} title={id}>
      <div className='product-name-box'>
        <span className="product-name">{name}</span>
      </div>
      <div className="product-price-related">
        {hasDiscount &&
          <div className="product-discount-box">
            <span className="product-discount">-{discountPercent}%</span>
          </div>
        }
        <div className='product-price-showcase'>
          {hasDiscount && (
            <span className='product-source-price'>${price}</span>
          )}
          <span className='product-current-price'>${currentPrice}</span>
        </div>
      </div>
    </article>
  );
}

export default FlatProductCard;