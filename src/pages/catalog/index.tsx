import { useEffect, useState } from "react";
import ProductCard, { ProductInfo } from '../../components/product-card';
import Navbar from '../../components/navbar';
import './catalog.scss';

function ProductCatalog() {
  const [products, setProducts] = useState<ProductInfo[] | null>(null);

  useEffect(() => {
    async function requestProducts() {
      const response = await fetch('/api/products');
      const productList = await response.json() as ProductInfo[];
      setProducts(productList);
    }

    if (!products) requestProducts();
  })

  return (
    <div className='catalog'>
      <Navbar />
      <div className='content'>
        <header className='catalog-header'>
          <div className='catalog-search-specification'>
            <h1 className='catalog-specification'>Catalog</h1>
          </div>
          <div className='search-boundary'>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder='Search'/>
          </div>
        </header>
        <div className='catalog-content'>
          <div className='catalog-filters'>

          </div>
          <table className='catalog-products'>
            {products && products.map(product => <ProductCard key={product.publicId} product={product} />)}
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog;