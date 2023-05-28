import { Product } from "../../models/product.model";
import AppTableRow from "../../layouts/AppTableRow";
import './inline-table-product-card.scss';

export interface InlineTableProductCardProps extends React.HTMLAttributes<HTMLTableRowElement> {
  readonly product: Product;
}

const InlineTableProductCard: React.FC<InlineTableProductCardProps> = (props) => {
  const {
    product,
    className,
    ...trProps
  } = props;

  const discountExists = product.discountPrice !== null && product.discountPrice < product.price;
  const discountPercent = discountExists ? Math.round(product.discountPrice / product.price * 100) : 0;

  return (
    <AppTableRow 
      {...trProps} 
      className={['inline-table-product-card', className].join(' ')}
    >
      <td className='common-info'>
        <div className="name-limiter">
          <span className='name'>{product.name}</span>
        </div>
        <div>
          <span className='info'>
            {product.tags.length} tags · {product.specifications.length} specs
          </span>
        </div>
      </td>
      <td>{product.state.toUpperCase()}</td>
      <td className='discount-percent discount-related'>
        {discountExists && (
          <div>
            <span>-{100 - discountPercent}%</span>
          </div>
        )}
      </td>
      <td className='previous-price'>{discountExists && `$${product.price}`}</td>
      <td className='current-price'>${discountExists ? product.discountPrice : product.price}</td>
    </AppTableRow>
  )
}

export default InlineTableProductCard;