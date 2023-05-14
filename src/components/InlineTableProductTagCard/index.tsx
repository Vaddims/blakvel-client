import { Product } from "../../models/product.model";
import AppTableRow from "../../layouts/AppTableRow";
import './inline-table-product-tag-card.scss';

export interface InlineTableProductTagCardProps extends React.HTMLAttributes<HTMLTableRowElement> {
  readonly productTag: Product.Tag;
}

const InlineTableProductTagCard: React.FC<InlineTableProductTagCardProps> = (props) => {
  const {
    productTag,
    ...trProps
  } = props;

  return (
    <AppTableRow {...trProps} className='inline-table-product-tag-card'>
      <td className='common-info'>
        <div className="name-limiter">
          <span className='name'>{productTag.name}</span>
        </div>
        <div>
          <span>
            <span className='info'>{productTag.fields.length} tags</span>
          </span>
        </div>
      </td>
    </AppTableRow>
  )
}

export default InlineTableProductTagCard;