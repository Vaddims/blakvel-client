import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import AdminPanel from '../../layouts/AdminPanel';
import Page from "../../layouts/Page";
import { useNavigate } from "react-router-dom";
import { useDeleteProductTagMutation, useGetProductTagsQuery } from "../../services/api/productsApi";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import InlineTableProductTagCard from "../../components/InlineTableProductTagCard";
import "./product-tag-management.scss";

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
      <button className="panel-tool edit highlight" onClick={redirectToProductTagInspector}>Edit</button>
      <button className="panel-tool delete" onClick={deleteSelectedTags}>Delete</button>
    </>
  );

  return (
    <Page id='admin-product-tag-management' onClick={deselectAllSelections}>
      <AdminPanel
        title="Tag Management"
        headerTools={selections.length === 0 ? defaultHeaderTools : selectionHeaderTools}
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