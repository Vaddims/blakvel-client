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
import useSearchParamState from '../../middleware/hooks/useSearchParamState';
import { stringToBoolean } from '../../utils/converters';
import './product-management.scss';

export type SortOptionType = keyof typeof sortOptions['clusters'];
export interface SortOption {
  readonly type: SortOptionType;
  readonly order: string;
}

export interface ElementSelectorButtonDiscountFilterPayload {
  readonly type?: string;
  readonly value?: any;
}

const AdminProductManagement: React.FC = () => {  
  const {
    paramCluster,
    urlSearchParams,
    applySearchCluster,
  } = useSearchParamState();
  
  const navigate = useNavigate();
  const { data: products = [] } = useGetProductsQuery(urlSearchParams.toString());
  const [ deleteProduct ] = useDeleteProductMutation();

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
    initialTarget: discountFilterOptions.find(option => (
      typeof paramCluster.hasDiscount.value === 'string' &&
      option.payload.value === stringToBoolean(paramCluster.hasDiscount.value)
    ))
  });

  useEffect(() => {
    if (filterSelector.selections[0]) {
      const selva = filterSelector.selections[0]?.payload.value ?? null;
      paramCluster.hasDiscount.set(selva === null ? null : selva.toString())
      applySearchCluster();
    }
  }, [filterSelector.getSelectionsInSequentialString()]);
  
  const applySortOption = (sortOption: SortOption | null) => {
    paramCluster.sort.set(sortOption?.type ?? null);
    paramCluster.order.set(sortOption?.order ?? null);
    applySearchCluster()
  }

  const onTablePropertySortChange = (type: SortOptionType) => () => {
    const circularOptionCluster = sortOptions.clusters[type] as SortOption[];
    if (paramCluster.sort.value === null) {
      if (circularOptionCluster.length === 0) {
        return;
      }

      applySortOption(circularOptionCluster[0]);
      return;
    }

    if (paramCluster.sort.value !== type) {
      applySortOption(circularOptionCluster[0]);
      return;
    }

    const index = circularOptionCluster.findIndex((option) => option.order === paramCluster.order.value);
    const nextOptionIndex = index + 1 < circularOptionCluster.length
      ? index + 1
      : null;

    if (nextOptionIndex === null) {
      applySortOption(null);
      return;
    }
 
    applySortOption(circularOptionCluster[nextOptionIndex]);
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
    const active = paramCluster.sort.value !== null && paramCluster.sort.value === sortOptionType;

    const getIconElement = (icon: IconDefinition) => (
      <FontAwesomeIcon icon={icon} className='sort-icon' />
    );

    if (!active) {
      return getIconElement(faSort);
    }

    switch (paramCluster.order.value) {
      case 'descending':
        return getIconElement(faSortUp);

      case 'ascending':
        return getIconElement(faSortDown);

      default:
        return getIconElement(faSort);
    }
  }

  const getTypeAriaSort = (type: SortOptionType): React.AriaAttributes['aria-sort'] => (
    type === paramCluster.sort.value
    ? ['ascending', 'descending'].includes(paramCluster.sort.value)
      ? paramCluster.sort.value as "descending" | "ascending"
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

export default AdminProductManagement;