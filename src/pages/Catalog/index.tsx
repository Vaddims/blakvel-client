import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePanelExtensionCollpase } from '../../middleware/hooks/usePanelExtensionsCollapse';
import { useGetProductsQuery } from "../../services/api/productsApi";
import ProductCard from '../../components/ProductCard';
import sortOptions from './radioSelectorOptions/sort.options.json';
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import useElementSelectorComponent from "../../middleware/component-hooks/element-selector-component/useElementSelectorComponent";
import ElementSelectorButtonOptions from "../../components/ElementSelectorOption/element-selector-options.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";
import './catalog.scss';
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import { UserRole } from "../../models/user.model";

export interface ElementSelectorPayload {
  order: string;
  type: string;
}

export default function Catalog() {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const auth = useAuthentication();

  const [ searchValue, setSearchValue ] = useState(searchParams.get('search') || '');
  const { collapsed: extensionsCollapsed, toggleCollapse } = usePanelExtensionCollpase();

  const a = new URLSearchParams(searchParams);
  if (auth.user) {
    a.set('format', UserRole.User);
  }
  const { data: products } = useGetProductsQuery(a.toString());
  
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

  const clearNameSearch: MouseEventHandler<SVGSVGElement> = (event) => {
    event.preventDefault();
    const localSearchParams = new URLSearchParams(searchParams);
    localSearchParams.delete('search');
    setSearchValue('');
    applySearchParams(localSearchParams);
  }

  const elementSelector = useElementSelectorComponent<ElementSelectorPayload>({
    title: "Sort",
    buttonOptions: sortOptions,
    initialTarget: sortTarget,
    dependencies: [searchParams.toString()]
  });

  useEffect(() => {
    const selection: ElementSelectorButtonOptions<ElementSelectorPayload> = elementSelector.selections[0];
    if (!selection) {
      return;
    }

    const selectionSearchParams = new URLSearchParams(searchParams);
    const fieldHanler = searchParamsFieldHandler(selectionSearchParams);
    fieldHanler('sort', selection.payload.type);
    fieldHanler('order', selection.payload.order);
    applySearchParams(selectionSearchParams);
  }, [elementSelector.selections.map(selection => selection.title).join(':')])

  const extensions = [
    elementSelector.render(),
  ]

  const headerTools = [
    (
      <div className='search-boundary'>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        <input 
          type="text" 
          placeholder='Search' 
          value={searchValue} 
          onKeyUp={handleSearchConfirm} 
          onChange={handleSearchChange}
        />
        { searchValue && (
          <FontAwesomeIcon icon={faTimes} onClick={clearNameSearch} />
        ) }
      </div>
    ),
    (
      <div className='catalog-filter-toggler-boundary' onClick={toggleCollapse}>
        <FontAwesomeIcon icon={faFilter} />
        <h4 className='catalog-filter-toggler-title'>Sort and Filter</h4>
      </div>
    ),
  ]

  return (
    <Page id='catalog'>
      <Panel 
        title='Catalog'
        extensions={extensions}
        headerTools={headerTools}
        collapseExtensions={extensionsCollapsed}
      >
        {products && products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/products/${product.id}`)} 
          />
        ))}
      </Panel>
    </Page>
  );
}
