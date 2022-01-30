import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react";
import ProductCard, { Product } from '../../components/product-card';
import { RadioSingleSelector } from '../../components/radio-selector';
import Navbar from '../../components/navbar';
import { RadioButtonOption } from "../../components/radio-button";
import { useNavigate, useSearchParams } from "react-router-dom";
import sortOptions from './sort.options.json';
import Footer from '../../components/footer';
import './catalog.scss';

type SortOptionSpecification = typeof sortOptions[number];

const sortOptionMap = new Map<RadioButtonOption, SortOptionSpecification>(
  sortOptions.map(option => [{ title: option.title, defaultSelection: option.default }, option])
);

interface ProductCatalogState {
  searchValue: string;
  filterCollapse: boolean;
  products: Product[];
}

function ProductCatalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const manageSearchParameter = (name: string, value: string) => {
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
  }

  const getFormatedSearchParameters = () => {
    const searchParamsString = searchParams.toString();
    return searchParamsString === '' ? '' : `?${searchParamsString}`;
  }

  const [state, setState] = useState<ProductCatalogState>({
    searchValue: searchParams.get('search') ?? '',
    filterCollapse: false,
    products: [],
  });

  useEffect(() => {
    async function updateProducts() {
      const response = await fetch(`/api/products?${searchParams.toString()}`);
      const products = await response.json();

      if (typeof products !== 'object' || !Array.isArray(products)) {
        return;
      }

      setState({ ...state, products, searchValue: searchParams.get('search') ?? '' });
    }

    updateProducts();
  }, [searchParams.toString()]);

  const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setState({ ...state, searchValue: value });
  }

  const toggleFilterVisibility = () => setState({ ...state, filterCollapse: !state.filterCollapse });
  const handleSortChange = (radioButtonOption: RadioButtonOption) => {
    const specificationOptions = sortOptionMap.get(radioButtonOption);
    if (!specificationOptions) {
      return;
    }

    manageSearchParameter('sort', specificationOptions.type);
    manageSearchParameter('order', specificationOptions.order);
    navigate(`/products${getFormatedSearchParameters()}`);
  };

  const keyup: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    manageSearchParameter('search',  state.searchValue);
    navigate(`/products${getFormatedSearchParameters()}`);
  }

  const clearNameSearch: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    manageSearchParameter('search', '');
    navigate(`/products${getFormatedSearchParameters()}`);
  }

  const type = searchParams.get('sort');
  const order = searchParams.get('order');
  const targetSortOptions = type && order 
    ? Array.from(sortOptionMap.entries()).find(([, optionInfo]) => optionInfo.order === order && optionInfo.type === type)?.[0]
    : undefined;

  return (
    <div className='catalog-page page'>
      <Navbar />
      <div className='content'>
        <header className='catalog-header'>
          <div className='catalog-search-specification'>
            <h1 className='catalog-name'>Catalog</h1>
            <h5 className="catalog-item-quantity">{state.products.length} items</h5>
          </div>
          <div className='catalog-filter'>
            <div className='search-boundary'>
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" placeholder='Search' value={state.searchValue} onKeyUp={keyup} onChange={onSearchInputChange}/>
              { state.searchValue && <i className="fas fa-times clear-icon" onClick={clearNameSearch}></i> }
            </div>
            <div className='catalog-filter-toggler-boundary' onClick={toggleFilterVisibility}>
              <i className="fas fa-filter"></i>
              <h4 className='catalog-filter-toggler-title'>Sort and Filter</h4>
            </div>
          </div>
        </header>
        <div className='catalog-content'>
          <div className='catalog-products'>
            {state.products.map(product => <ProductCard key={product.publicId} product={product} />)}
          </div>
          {!state.filterCollapse && 
            <div className="catalog-filter-box">
              <div className='catalog-filter-slidepath'>
                <div className="catalog-filters">
                  <RadioSingleSelector title="Sort" options={Array.from(sortOptionMap.keys())} target={targetSortOptions} onTargetChange={handleSortChange} />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default ProductCatalog;