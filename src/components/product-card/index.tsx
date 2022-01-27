import { Link } from 'react-router-dom';
import './product-card.scss';

interface ProductCardProps {
  product: ProductInfo;
}

export interface ProductInfo {
  publicId: string;
  name: string;
  tags: string[];
  price: number;
  originPrice: number | null;
  stock: number;
  urn: {
    thumbs: string[];
    thumbnail: string | null;
  }
}

function ProductCard(props: ProductCardProps) {
  const { publicId, name, tags, price, originPrice, urn } = props.product;

  const hasDiscount = originPrice && originPrice > price;
  const discountPercent = hasDiscount ? Math.round(price / originPrice * 100) : 0;

  return (
    <article className='product-card'>
      <div className='product-image-boundary'>
        {urn.thumbnail ? <img src={`api/products/${publicId}/thumbnail`} alt='Product thumbnail' /> : <i className="fas fa-3x fa-image product-image-absence"/>}
      </div>
      <div className='product-details'>
        <h5 className='product-type'>Object</h5>
        <h2 className='product-name'>{name}</h2>
        <div className='product-pricing-related'>
          {hasDiscount && 
            <div className='product-discount-box'>
              <h5 className='product-discount'>-{discountPercent}%</h5>
            </div>
          }
          <div className='product-price-showcase'>
            <h3 className='product-current-price'>${price}</h3>
            {hasDiscount && <h3 className='product-source-price'>${originPrice}</h3>}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard;