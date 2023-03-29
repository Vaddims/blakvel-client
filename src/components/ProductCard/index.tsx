import { Product } from "../../models/product.model";
import './product-card.scss';

interface ProductCardProps extends React.HTMLProps<HTMLElement> {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { id, name, price, discountPrice, urn } = props.product;

  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount ? (100 - Math.round(discountPrice / price * 100)) : 0;
  const currentPrice = hasDiscount ? discountPrice : price;

  return (
    <article className='product-card' {...props} title={id}>
      <div className='product-image-boundary'>
        {urn.thumbnail 
          ? <img src={`api/products/${id}/thumbnail`} loading='lazy' alt='Product thumbnail' /> 
          : <i className="fas fa-3x fa-image product-image-absence"/>
        }
      </div>
      <div className='product-details'>
        <h2 className='product-name'>{name}</h2>
        <div className='product-pricing-related'>
          {hasDiscount && 
            <div className='product-discount-box'>
              <h5 className='product-discount'>-{discountPercent}%</h5>
            </div>
          }
          <div className='product-price-showcase'>
            <h3 className='product-current-price'>${currentPrice}</h3>
            {hasDiscount && <h3 className='product-source-price'>${price}</h3>}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard;