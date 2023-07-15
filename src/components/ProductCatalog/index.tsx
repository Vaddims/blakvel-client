import { useNavigate } from "react-router-dom";
import { Product } from "../../models/product.model";
import ProductCard from "../ProductCard";
import './product-catalog.scss';

export enum ProductCatalogElementSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

interface ProductCatalogProps {
  readonly products?: Product[];
  readonly className?: string;
  readonly productCardClassName?: string;
  readonly productCardSize?: ProductCatalogElementSize; 
}

const ProductCatalog: React.FC<ProductCatalogProps> = (props) => {
  const navigate = useNavigate();

  const catalogClassName = ['product-catalog', props.className].join(' ');
  const productCardClassName = ['catalog-product-card', props.productCardClassName].join(' ');

  if (!props.products || props.products.length === 0) {
    return (
      <main>
        {props.children}
      </main>
    )
  }

  return (
    <div className={catalogClassName} data-product-card-size={props.productCardSize ?? ProductCatalogElementSize.Medium}>
      {props.products && props.products.map(product => (
        <ProductCard
          className={productCardClassName}
          key={product.id}
          product={product}
          onClick={() => navigate(`/products/${product.id}`)} 
        />
      ))}
    </div>
  )
}

export default ProductCatalog;