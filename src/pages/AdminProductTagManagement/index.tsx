import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import AdminPanel from '../../layouts/AdminPanel';
import Page from "../../layouts/Page";
import { useNavigate } from "react-router-dom";
import { useDeleteProductTagMutation, useGetProductTagsQuery } from "../../services/api/coreApi";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import InlineTableProductTagCard from "../../components/InlineTableProductTagCard";
import "./product-tag-management.scss";
import { ReactNode } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import useSearchParamState from "../../middleware/hooks/useSearchParamState";
import { InputField } from "../../middleware/hooks/input-field-hook";

export default function AdminProductTagManagement() {
  const { data: productTags = [] } = useGetProductTagsQuery();
  const [ deleteProductTag ] = useDeleteProductTagMutation();

  const {
    selections,
    elementIsSelected,
    deselectAllSelections,
    allElementsAreSelected,
    selectMultipleElements,
    handleSelectionEvent
  } = useSequentialElementSelection(productTags, {
    identifier: (productTag) => productTag.id,
  });

  const navigate = useNavigate();

  const {
    paramCluster,
    clear: clearSearchCluster,
    urlSearchParams,
    applySearchCluster,
  } = useSearchParamState();

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

  const minFieldQuantityFilterInput = useTextInputField({
    label: 'Fields',
    required: true,
    placeholder: '-',
    inputPrefix: 'Min:',
    className: 'r',
    hideClear: true,
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.minFields.set(state).apply();
    }
  });

  const maxFieldQuantityFilterInput = useTextInputField({
    inputPrefix: 'Max:',
    hideClear: true,
    placeholder: '-',
    className: 'l',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.maxFields.set(state).apply();
    }
  });

  const redirectToProductTagInspector = () => {
    if (selections.length === 1) {
      navigate(`/product-tags/${selections[0].id}/inspect`);
      return;
    }

    const searchParams = new URLSearchParams();
    for (const selection of selections) {
      searchParams.append('target', selection.id);
    }

    navigate(`/product-tags/inspect?${searchParams.toString()}`);
  }

  const deleteSelectedTags = async () => {
    for (const selection of selections) {
      try {
        await deleteProductTag(selection.id).unwrap();
      } catch {}
    }
  }

  const onBulkSelectionClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    if (allElementsAreSelected()) {
      deselectAllSelections();
    } else {
      selectMultipleElements(productTags);
    }
  }

  const defaultHeaderTools = (
    <>
      <button className="panel-tool highlight" onClick={() => navigate('/product-tags/create')}>New Tag</button>
    </>
  );

  const selectionHeaderTools = (
    <>
      {selections.length === 1 && (
        <button 
          className="panel-tool edit highlight" 
          onClick={redirectToProductTagInspector}
        >
          Edit
        </button>
      )}
      <button className="panel-tool delete" onClick={deleteSelectedTags}>Delete</button>
    </>
  );

  const subheader: ReactNode[] = [
    <span>Showing <span className='highlight'>{ productTags.length }</span> tags</span>,
  ]

  const extensions = (
    <div className='admin-panel-management-extensions'>
      <header>
        <span>Filters</span>
      </header>
      <div className='filter-content'>
        <div className='field-quantity-range'>
          { minFieldQuantityFilterInput.render() }
          { maxFieldQuantityFilterInput.render() }
        </div>
      </div>
    </div>
  )

  return (
    <Page id='admin-product-tag-management' onClick={deselectAllSelections}>
      <AdminPanel
        title="Tag Management"
        extensions={extensions}
        headerTools={selections.length === 0 ? defaultHeaderTools : selectionHeaderTools}
        subheader={subheader}
        headerCenterTools={globalSearchInput.render()}
      >
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow 
              onCheckboxClick={onBulkSelectionClick}
              aria-selected={allElementsAreSelected()}
            >
              <td className='name'>Tag</td>
            </AppTableRow>
          </thead>
          <tbody>
            {productTags.map(productTag => (
              <InlineTableProductTagCard 
                onDoubleClick={() => navigate(`/product-tags/${productTag.id}/inspect`)}
                onClick={handleSelectionEvent(productTag)}
                aria-selected={elementIsSelected(productTag)}
                productTag={productTag}
              />
            ))}
          </tbody>
        </AppTable>
      </AdminPanel>
    </Page>
  );
}