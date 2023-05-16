import { useSequentialElementSelection } from '../../middleware/hooks/useSequentialElementSelection';
import { useDeleteProductMutation, useGetProductsQuery } from '../../services/api/productsApi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AdminPanel from '../../layouts/AdminPanel';
import Page from '../../layouts/Page';
import InlineTableProductCard from '../../components/InlineTableProductCard';
import * as sortOptions from './sort.options.json';
import { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import discountFilterOptions from './discount-filter.options.json';
import useElementSelectorComponent from '../../middleware/component-hooks/element-selector-component/useElementSelectorComponent';
import AppTable from '../../layouts/AppTable';
import AppTableRow from '../../layouts/AppTableRow';
import './product-management.scss';

interface ElementSelectorButtonDiscountFilterPayload {
  type?: string;
  value?: any;
}

export type SortOptionType = keyof typeof sortOptions['clusters'];
export interface SortOption {
  readonly type: SortOptionType;
  readonly order: string;
}

export default function AdminProductManagement() {  
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const [ sortingOption, setSortingOption ] = useState<SortOption | null>(null);

  const [ deleteProduct ] = useDeleteProductMutation();
  const { data: products = [] } = useGetProductsQuery(searchParams.toString());

  const { 
    selections,
    allElementsAreSelected,
    deselectAllSelections,
    handleSelectionEvent,
    elementIsSelected,
    handleElementBulkSelection,
  } = useSequentialElementSelection(products, {
    identifier: (product) => product.id,
  });

  const filterSelector = useElementSelectorComponent<ElementSelectorButtonDiscountFilterPayload>({
    title: 'Discount Filter',
    multiple: false,
    identifyOptions: (option) => option.title,
    buttonOptions: discountFilterOptions,
    initialTarget: (
      discountFilterOptions.find(option => (
        typeof option.payload.type !== 'undefined' && 
        typeof option.payload.value !== 'undefined' && 
        searchParams.get(option.payload.type) === option.payload.value.toString()
      ))
    ),
  });

  const constructSearchParams = (providedSearchParams: URLSearchParams) => {
    const params = new URLSearchParams(providedSearchParams);
    const handler = searchParamsFieldHandler(params)
    handler('sort', sortingOption?.type)
    handler('order', sortingOption?.order);

    if (filterSelector.selections[0]?.payload.type && typeof filterSelector.selections[0]?.payload.value !== 'undefined') {
      handler(filterSelector.selections[0].payload.type, filterSelector.selections[0].payload.value);
    } else {
      handler('hasDiscount')
    }

    return params;
  }

  useEffect(() => {
    const params = constructSearchParams(searchParams);
    const urlEncodedSearchParams = params.toString();
    const pathSearchParams = urlEncodedSearchParams === '' ? '' : `?${urlEncodedSearchParams}`;
    navigate(`/admin-panel/product-management${pathSearchParams}`);
  }, [sortingOption?.type, sortingOption?.order, filterSelector.getSelectionsInSequentialString()])

  const searchParamsFieldHandler = (searchParams: URLSearchParams) => (key: string, value?: string, add = false) => {
    if (typeof value !== 'undefined') {
      if (searchParams.has(key) && add && searchParams.get(key) !== value.toString()) {
        searchParams.append(key, value)
      } else {
        searchParams.set(key, value)
      }
    } else {
      searchParams.delete(key);
    }
  }

  const onTablePropertySortChange = (type: SortOptionType) => () => {
    const cluster = sortOptions.clusters[type] as SortOption[];
    if (!sortingOption) {
      if (cluster.length === 0) {
        return;
      }

      setSortingOption(cluster[0]);
      return;
    }

    if (sortingOption.type !== type) {
      setSortingOption(cluster[0]);
      return;
    }

    const index = cluster.findIndex((option) => option.order === sortingOption.order);
    const nextOptionIndex = index + 1 < cluster.length
      ? index + 1
      : null;

    if (nextOptionIndex === null) {
      setSortingOption(null);
      return;
    }
 
    setSortingOption(cluster[nextOptionIndex]);
  }

  const redirectToProductInspector = () => {
    if (selections.length === 1) {
      navigate(`/products/${selections[0].id}/inspect`);
      return;
    }

    const url = new URL(`/products/inspect`, window.location.origin);
    for (const selection of selections) {
      url.searchParams.append('target', selection.id);
    }
    navigate(url);
  }

  const deleteAllSelections = async () => {
    for (const selection of selections) {
      await deleteProduct(selection.id);
    }
  }

  const bulkSelectionHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    handleElementBulkSelection();
  }

  const defaultHeaderTools = (
    <Link to='/products/create' className="panel-tool highlight">New Product</Link>
  );

  const selectionHeaderTools = (
    <>
      <button className="panel-tool outline-highlight">Mark as Fixed</button>
      <button className="panel-tool edit highlight" onClick={redirectToProductInspector}>Edit</button>
      <button className="panel-tool delete" onClick={deleteAllSelections}>Delete</button>
    </>
  );

  const headerTools = selections.length > 0 ? selectionHeaderTools : defaultHeaderTools;

  const getSortIcon = (sortOptionType: SortOptionType) => {
    const active = sortingOption?.type === sortOptionType;

    const getIconElement = (icon: IconDefinition) => (
      <FontAwesomeIcon icon={icon} className='sort-icon' />
    );

    if (!active) {
      return getIconElement(faSort);
    }

    switch (sortingOption.order) {
      case 'descending':
        return getIconElement(faSortUp);

      case 'ascending':
        return getIconElement(faSortDown);

      default:
        return getIconElement(faSort);
    }
  }

  const getTypeAriaSort = (type: SortOptionType): React.AriaAttributes['aria-sort'] => (
    type === sortingOption?.type 
    ? ['ascending', 'descending'].includes(sortingOption.order)
      ? sortingOption.order as "descending" | "ascending"
      : 'other'
    : 'none'
  );

  const extensions: ReactNode[] = [
    filterSelector.render(),
  ]

  return (
    <Page id='admin-product-management' onClick={deselectAllSelections}>
      <AdminPanel title="Product Management" headerTools={headerTools} extensions={extensions}>
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow 
              onCheckboxClick={bulkSelectionHandler} 
              aria-selected={allElementsAreSelected()}
            >
              <td 
                className='name' 
                onClick={onTablePropertySortChange('name')} 
                aria-sort={getTypeAriaSort('name')}
              >
                { getSortIcon('name') } Product
              </td>
              <td aria-sort={getTypeAriaSort('status')} >
                Status
              </td>
              <td 
                onClick={onTablePropertySortChange('discountPercentage')}
                aria-sort={getTypeAriaSort('discountPercentage')}
              >
                { getSortIcon('discountPercentage') } Discount
              </td>
              <td 
                onClick={onTablePropertySortChange('inactivePrice')}
                aria-sort={getTypeAriaSort('inactivePrice')}
              >
                { getSortIcon('inactivePrice') } Prior Price
              </td>
              <td 
                onClick={onTablePropertySortChange('activePrice')}
                aria-sort={getTypeAriaSort('activePrice')}
              >
                { getSortIcon('activePrice') } Price
              </td>
            </AppTableRow>
          </thead>
          <tbody>
            {products.map((product) => (
              <InlineTableProductCard
                key={product.id}
                product={product} 
                onClick={handleSelectionEvent(product)}
                onDoubleClick={() => navigate(`/products/${product.id}/inspect`)}
                aria-multiselectable
                aria-selected={elementIsSelected(product)}
              />
            ))}
          </tbody>
        </AppTable>
      </AdminPanel>
    </Page>
  );
}