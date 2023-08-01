import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePanelExtensionCollpase } from '../../middleware/hooks/usePanelExtensionsCollapse';
import { useGetProductsQuery } from "../../services/api/coreApi";
import ProductCard from '../../components/ProductCard';
import sortOptions from './radioSelectorOptions/sort.options.json';
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import useElementSelectorComponent from "../../middleware/component-hooks/element-selector-component/useElementSelectorComponent";
import ElementSelectorButtonOptions from "../../components/ElementSelectorOption/element-selector-options.interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import './catalog.scss';
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import useSearchParamState from "../../middleware/hooks/useSearchParamState";
import { InputField } from "../../middleware/hooks/input-field-hook";
import ProductCatalog, { ProductCatalogElementSize } from "../../components/ProductCatalog";
import { UserDto } from "../../dto/user/user.dto";

export interface ElementSelectorPayload {
  order: string;
  type: string;
}

export default function Catalog() {
  const navigate = useNavigate();
  const auth = useAuthentication();

  const {
    paramCluster,
    urlSearchParams,
    applySearchCluster,
  } = useSearchParamState();

  const { collapsed: extensionsCollapsed, toggleCollapse } = usePanelExtensionCollpase();

  const requestSearchParams = new URLSearchParams(urlSearchParams);
  if (auth.user) {
    requestSearchParams.set('format', UserDto.Role.Customer);
  }
  // TODO Limit requested products to a fixed small number
  const { data: products } = useGetProductsQuery(requestSearchParams.toString());

  const getInitialSortOption = () => {
    const type = paramCluster.sort.value;
    const order = paramCluster.order.value;
  
    return type && order && (
      sortOptions.find(({ payload }) => payload.type === type && payload.order === order)
    ) || (
      sortOptions.find((options) => options.defaultSelection)
    );
  }

  const searchInput = useTextInputField({
    placeholder: 'Search',
    inputIcon: faSearch,
    value: paramCluster.search.value ?? '',
    trackValue: true,
    validationTimings: [InputField.ValidationTiming.Submit],
    validate(data) {
      return data;
    },
    onSubmit(data) {
      paramCluster.search.set(data).apply();
    },
    onClear() {
      paramCluster.search.remove().apply();
    }
  })

  const elementSelector = useElementSelectorComponent<ElementSelectorPayload>({
    title: "Sort",
    buttonOptions: sortOptions,
    initialTarget: getInitialSortOption(),
    dependencies: [urlSearchParams.toString()]
  });

  useEffect(() => {
    const selection: ElementSelectorButtonOptions<ElementSelectorPayload> = elementSelector.selections[0];
    if (!selection) {
      return;
    }

    paramCluster.sort.set(selection.payload.type);
    paramCluster.order.set(selection.payload.order);
    applySearchCluster();
  }, [elementSelector.selections.map(selection => selection.title).join(':')])

  const extensions = [
    elementSelector.render(),
  ]

  const middleTools = [
    searchInput.render()
  ]

  const headerTools = [
    (
      <div className='catalog-filter-toggler-boundary' onClick={toggleCollapse}>
        <FontAwesomeIcon icon={faFilter} />
        <h4 className='catalog-filter-toggler-title'>Sort and Filter</h4>
      </div>
    ),
  ];

  const subheader = [
    (
      <span>Showing <span className="highlight">{products?.length ?? '?'}</span> products</span>
    )
  ];

  return (
    <Page id='catalog'>
      <Panel 
        title='Catalog'
        extensions={extensions}
        headerTools={headerTools}
        collapseExtensions={extensionsCollapsed}
        headerCenterTools={middleTools}
        subheader={subheader}
      >
        <ProductCatalog 
          products={products ?? []} 
          productCardSize={ProductCatalogElementSize.Large}
        />
      </Panel>
    </Page>
  );
}
