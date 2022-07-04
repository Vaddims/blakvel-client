import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RadioButtonOptions } from "../../components/RadioButton/radio-button-options.interface";
import { usePanelExtensionCollpase } from '../../middleware/hooks/usePanelExtensionsCollapse';
import { useGetProductsQuery } from "../../services/api/productsApi";
import ProductCard from '../../components/ProductCard';
import sortOptions from './radioSelectorOptions/sort.options.json';
import RadioSelector from "../../components/RadioSelector";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import './catalog.scss';

export default function Catalog() {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();

  const [ searchValue, setSearchValue ] = useState(searchParams.get('search') || '');
  const { collapsed: extensionsCollapsed, toggleCollapse } = usePanelExtensionCollpase();

  const { data: products } = useGetProductsQuery(searchParams.toString());
  
  const type = searchParams.get('sort');
  const order = searchParams.get('order');

  const sortTarget = (type && order && sortOptions.find(
    ({ payload }) => payload.type === type && payload.order === order
  )) || sortOptions.find((options) => options.defaultSelection);

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  }

  const searchParamsFieldHandler = (searchParams: URLSearchParams) => (key: string, value?: string) => {
    if (value) {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key);
    }
  }
  
  const applySearchParams = (searchParams: URLSearchParams) => {
    const urlEncodedSearchParams = searchParams.toString();
    const pathSearchParams = urlEncodedSearchParams === '' ? '' : `?${urlEncodedSearchParams}`;
    navigate(`/products${pathSearchParams}`);
  }

  const handleSearchConfirm: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    const localSearchParams = new URLSearchParams(searchParams);
    const fieldHandler = searchParamsFieldHandler(localSearchParams);
    fieldHandler('search', searchValue);
    applySearchParams(localSearchParams);
  }

  const clearNameSearch: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    const localSearchParams = new URLSearchParams(searchParams);
    localSearchParams.delete('search');
    setSearchValue('');
    applySearchParams(localSearchParams);
  }

  type SortOptionsPayload = typeof sortOptions[number]['payload'];
  const handleSelection = (radioButtonOptions: RadioButtonOptions<SortOptionsPayload>) => {
    const { payload } = radioButtonOptions;

    if (!payload || sortTarget?.title === radioButtonOptions.title) {
      return;
    }

    const selectionSearchParams = new URLSearchParams(searchParams);
    const fieldHanler = searchParamsFieldHandler(selectionSearchParams);
    fieldHanler('sort', payload.type);
    fieldHanler('order', payload.order);
    applySearchParams(selectionSearchParams);
  }

  const extensions = (
    <RadioSelector
      title="Sort"
      buttonOptions={sortOptions}
      initialTarget={sortTarget}
      onSelectionChange={handleSelection}
      dependencies={[searchParams.toString()]}
    />
  );

  const headerTools = (
    <>
      <div className='search-boundary'>
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input 
          type="text" 
          placeholder='Search' 
          value={searchValue} 
          onKeyUp={handleSearchConfirm} 
          onChange={handleSearchChange}
        />
        { searchValue && <i className="fas fa-times clear-icon" onClick={clearNameSearch}></i> }
      </div>
      <div className='catalog-filter-toggler-boundary' onClick={toggleCollapse}>
        <i className="fas fa-filter"></i>
        <h4 className='catalog-filter-toggler-title'>Sort and Filter</h4>
      </div>
    </>
  )

  return (
    <Page id='catalog'>
      <Panel 
        title='Catalog'
        extensions={extensions}
        headerTools={headerTools}
        collapseExtensions={extensionsCollapsed}
      >
        {products && products.map(product => 
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/products/${product.id}`)} 
          />)
        }
      </Panel>
    </Page>
  );
}
