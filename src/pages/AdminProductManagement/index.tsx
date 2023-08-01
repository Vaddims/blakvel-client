import { useSequentialElementSelection } from '../../middleware/hooks/useSequentialElementSelection';
import { useDeleteProductMutation, useGetProductsQuery } from '../../services/api/coreApi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AdminPanel from '../../layouts/AdminPanel';
import Page from '../../layouts/Page';
import InlineTableProductCard from '../../components/InlineTableProductCard';
import * as sortOptions from './sort.options.json';
import { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faDollar, faEdit, faFilterCircleXmark, faMagnifyingGlassMinus, faPercent, faPercentage, faSearch, faSort, faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import stateFilterOptions from './state-filter.options.json';
import AppTable from '../../layouts/AppTable';
import AppTableRow from '../../layouts/AppTableRow';
import useSearchParamState from '../../middleware/hooks/useSearchParamState';
import './product-management.scss';
import { useAuthentication } from '../../middleware/hooks/useAuthentication';
import useTextInputField from '../../middleware/hooks/text-input-field-hook';
import { InputField } from '../../middleware/hooks/input-field-hook';
import useSelectInputField, { SelectInputFieldOption } from '../../middleware/hooks/select-input-field-hook';
import { ProductDto } from '../../dto/product/product.dto';

const expirationOptions = {
  none: {
    title: 'None',
    value: 'none',
  },
  before: {
    title: 'Expires Before',
    value: 'exp_bfr',
  },
  after: {
    title: 'Expires After',
    value: 'exp_aftr',
  },
  queal: {
    title: 'Expires At Day',
    value: 'exp_at_day'
  },
}

export type SortOptionType = keyof typeof sortOptions['clusters'];
export interface SortOption {
  readonly type: SortOptionType;
  readonly order: string;
}

export interface ElementSelectorButtonDiscountFilterPayload {
  readonly type?: string;
  readonly value?: any;
}

const discountFilter = {
  all: {
    title: 'All',
    value: 'none',
    defaultSelection: true,
  } as SelectInputFieldOption,
  discounted: {
    title: 'Discounted',
    value: 'true',
  } as SelectInputFieldOption,
  nonDiscounted: {
    title: 'Non-discounted',
    value: 'false'
  } as SelectInputFieldOption,
} as const;

const findDsicountFilter = (v: string) => {
  return Object.values(discountFilter).find(filter => filter.value === v);
}

const AdminProductManagement: React.FC = () => {  
  const {
    paramCluster,
    clear: clearSearchCluster,
    urlSearchParams,
    applySearchCluster,
  } = useSearchParamState();

  const auth = useAuthentication();

  const requestSearchParams = new URLSearchParams(urlSearchParams);
  if (auth.user) {
    requestSearchParams.set('format', auth.user.role);
  }
  
  const navigate = useNavigate();
  const { 
    data: products = [], 
    isLoading: productsAreLoading,
  } = useGetProductsQuery(requestSearchParams.toString());
  const [ deleteProduct ] = useDeleteProductMutation();

  const { 
    selections,
    allElementsAreSelected,
    deselectAllSelections,
    toggleAdditionalElement,
    handleSelectionEvent,
    elementIsSelected,
    handleElementBulkSelection,
  } = useSequentialElementSelection(products, {
    identifier: (product) => product.id,
  });

  const globalSearchInput = useTextInputField({
    inputIcon: faSearch,
    placeholder: 'Search',
    value: paramCluster.search.value ?? '',
    trackValue: true,
    validationTimings: [InputField.ValidationTiming.Submit],
    changeDebouncingTimeout: 500,
    onChange(data) {
      paramCluster.search.set(data.length === 0 ? null : data).apply();
    },
    onSubmit(data) {
      paramCluster.search.set(data.length === 0 ? null : data);
      applySearchCluster();
    },
    onClear() {
      paramCluster.search.set(null);
      applySearchCluster();
    }
  });

  const changeDebouncingTimeout = 500;

  const minPrice = useTextInputField({
    label: 'Price',
    placeholder: 'Min',
    value: paramCluster.minPrice.value ?? '',
    required: true,
    inputIcon: faDollar,
    hideClear: true,
    className: 'r',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.minPrice.set(state).apply();
    }
  });

  const maxPrice = useTextInputField({
    placeholder: 'Max',
    required: true,
    value: paramCluster.maxPrice.value ?? '',
    inputIcon: faDollar,
    hideClear: true,
    className: 'l',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.maxPrice.set(state).apply();
    }
  });

  const discountFilterSelector = useSelectInputField({
    label: 'Discount',
    required: true,
    value: paramCluster.hasDiscount.value ? findDsicountFilter(paramCluster.hasDiscount.value) : discountFilter.all,
    options: Object.values(discountFilter),
    dynamicClassName(state) {
      return state.value === discountFilter.discounted.value ? 'b' : '';
    },
  });

  const minDiscountPercentagePrice = useTextInputField({
    placeholder: 'Min',
    required: true,
    value: paramCluster.minDiscountPercentage.value ?? '',
    inputIcon: faPercent,
    hideClear: true,
    className: 't r b',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.minDiscountPercentage.set(state).apply();
    }
  });

  const maxDiscountPercentagePrice = useTextInputField({
    placeholder: 'Max',
    required: true,
    value: paramCluster.maxDiscountPercentage.value ?? '',
    inputIcon: faPercent,
    hideClear: true,
    className: 't l b',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.maxDiscountPercentage.set(state).apply();
    }
  });

  const minDiscountPrice = useTextInputField({
    placeholder: 'Min',
    required: true,
    value: paramCluster.minPriorPrice.value ?? '',
    inputIcon: faDollar,
    hideClear: true,
    className: 't r',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.minPriorPrice.set(state).apply();
    }
  });

  const maxDiscountPrice = useTextInputField({
    placeholder: 'Max',
    required: true,
    value: paramCluster.maxPriorPrice.value ?? '',
    inputIcon: faDollar,
    hideClear: true,
    className: 't l',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.maxPriorPrice.set(state).apply();
    }
  });

  const stateFilterSelector = useSelectInputField({
    label: 'State',
    required: true,
    value: stateFilterOptions.find(filter => filter.value === paramCluster.hasState.value) ?? stateFilterOptions[0],
    options: stateFilterOptions,
  });

  const expStartDate = useTextInputField({
    required: true,
    label: 'Discount Expiration',
    type: 'date',
    inputPrefix: 'From:',
    className: 'b',
  })

  const expEndDate = useTextInputField({
    inputPrefix: 'To:',
    type: 'date',
    className: 't'
  })

  const filters: {name: string, value: string}[] = [
    // ...discountFilterSelector.selections.filter(option => option.payload.type).map(option => ({ name: option.title, value: option.title as string })),
    // ...stateFilterSelector.selections.map(option => ({ name: option.title, value: option.payload as string })),
  ]

  if (paramCluster.search.value) {
    filters.unshift({ name: 'Search', value: `${paramCluster.search.value}` })
  }

  useEffect(() => {
    if (discountFilterSelector.value.value === discountFilter.all.value) {
      paramCluster.hasDiscount.remove().apply();
      return;
    }

    paramCluster.hasDiscount.set(discountFilterSelector.value.value).apply();
  }, [discountFilterSelector.value]);

  useEffect(() => {
    if (stateFilterSelector.value.value === stateFilterOptions[0].value) {
      paramCluster.hasState.remove().apply()
      return;
    }

    paramCluster.hasState.set(stateFilterSelector.value.value).apply();
  }, [stateFilterSelector.value]);

  // useEffect(() => {
  //   const validationResult = minPrice.validate(true);

  // }, [minPrice.value]);
  
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
      navigate(`/products?inspect=${selections[0].id}`);
      return;
    }

    const urlSearchParams = new URLSearchParams();
    for (const selection of selections) {
      urlSearchParams.append('inspect', selection.id);
    }

    navigate(`/products?${urlSearchParams.toString()}`);
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

  const selectionHeaderTools = (
    <>
      <button className="panel-tool edit highlight" onClick={redirectToProductInspector}>
        <FontAwesomeIcon icon={faEdit} />
        Edit
      </button>
      <button className="panel-tool delete" onClick={deleteAllSelections}>
        <FontAwesomeIcon icon={faTrash} />
        Delete
      </button>
    </>
  );

  const selectionHeaderCentralTools = [
    globalSearchInput.render(),
  ]

  const headerTools = selections.length > 0 ? selectionHeaderTools : defaultHeaderTools;


  // const extensions: ReactNode[] = [
  //   discountFilterSelector.render(),
  //   stateFilterSelector.render(),
  // ];
  const a = discountFilterSelector.validate(true);

  const extensions = (
    <div className='admin-panel-management-extensions'>
      <header>
        <span>Filters</span>
      </header>
      <div className='filter-content'>
        <div className='price'>
          {minPrice.render()}
          {maxPrice.render()}
        </div>
        <div className='discount'>
          {discountFilterSelector.render()}
          {a.isValid && a.data?.value === discountFilter.discounted.value && (
            <>
              <div className='price-percentage-range-container'>
                {minDiscountPercentagePrice.render()}
                {maxDiscountPercentagePrice.render()}
              </div>
              <div className='price-range-container'>
                {minDiscountPrice.render()}
                {maxDiscountPrice.render()}
              </div>
              <div className='exp-date-container'>
                {expStartDate.render()}
                {expEndDate.render()}
              </div>
            </>
          )}
        </div>
        {stateFilterSelector.render()}
      </div>
    </div>
  )

  const subheader: ReactNode[] = [
    <span>Showing <span className='highlight'>{ products.length }</span> products</span>,
  ]

  if (filters.length > 0) {
    subheader.push((
      <span>Active Fitlers:{filters.map((filter, index) => (
        <span> {index === 0 ? '' : '·'} <span className='highlight'>{filter.value.toUpperCase()}</span></span>
      ))}</span>
    ))
  }

  const clearFilters = () => {
    clearSearchCluster();
    applySearchCluster();
  }

  const toggleProductCard = (product: ProductDto): React.MouseEventHandler<HTMLButtonElement> => (event) => {
    event.stopPropagation()
    toggleAdditionalElement(product);
  }

  return (
    <Page id='admin-product-management' onClick={deselectAllSelections}>
      <AdminPanel 
        title="Product Management" 
        headerTools={headerTools} 
        headerCenterTools={selectionHeaderCentralTools}
        extensions={extensions}
        subheader={subheader}
      >
        {productsAreLoading ? (
          <h1>Loading</h1>
        ) : products.length > 0 ? (
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
                  onDoubleClick={() => navigate(`/products?inspect=${product.id}`)}
                  onCheckboxClick={toggleProductCard(product)}
                  aria-multiselectable
                  aria-selected={elementIsSelected(product)}
                />
              ))}
            </tbody>
          </AppTable>
        ) : (
          <div className='product-absence'>
            <FontAwesomeIcon icon={faFilterCircleXmark} size={'5x'} />
            <h1 className='title'>No products found</h1>
            <span className='description'>Maybe the applied filters are too specific</span>
            <button className='action' onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </AdminPanel>
    </Page>
  );
}

export default AdminProductManagement;