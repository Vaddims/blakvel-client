import { useEffect, useState } from "react";
import ProductCard, { ProductInfo } from '../../components/product-card';
import RadioSelector from '../../components/radio-selector';
import Navbar from '../../components/navbar';
import './catalog.scss';
import RadioButton, { RadioButtonOptions } from "../../components/radio-button";

const sortOptions: RadioButtonOptions[] = [
  {
    title: 'Default',
    defaultSelection: true,
  },
  {
    title: "Best Selling",
  },
  {
    title: "Most Viewed",
  },
  {
    title: "Name (A - Z)",
  },
  {
    title: "Name (Z - A)",
  },
  {
    title: "Price (Low - High)",
  },
  {
    title: "Price (High - Low)",
  },
];

const typeOptions: RadioButtonOptions[] = [
  {
    title: "Food",
  },
  {
    title: "Toys",
  },
  {
    title: "Houses",
  },
  {
    title: "Other",
  },
]

const filterOptions: RadioButtonOptions[] = [
  {
    title: "In Stock",
  },
]

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
    <div className='catalog-page'>
      <Navbar />
      <div className='content'>
        <header className='catalog-header'>
          <div className='catalog-search-specification'>
            <h1 className='catalog-name'>Catalog</h1>
            {products && <h5 className="catalog-item-quantity">{products.length} items</h5>}
          </div>
          <div className='catalog-filter'>
            <div className='catalog-filter-toggler-boundary'>
              <i className="fas fa-filter"></i>
              <h4 className='catalog-filter-toggler-title'>Sort and Filter</h4>
            </div>
          </div>
          {/* <div className='search-boundary'>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder='Search'/>
          </div> */}
        </header>
        <div className='catalog-content'>
          <div className='catalog-products'>
            {products && products.map(product => <ProductCard key={product.publicId} product={product} />)}
          </div>
          <div className="catalog-filter-box">
            <div className='catalog-filter-slidepath'>
              <div className="catalog-filters">
                <RadioSelector title="Sort" options={sortOptions} />
                <RadioSelector title="Type" options={typeOptions} multiple />
                <RadioSelector title="Filters" options={filterOptions} multiple />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCatalog;