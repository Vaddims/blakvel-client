import { useFlatElementSelection } from "../../middleware/hooks/useFlatElementSelection";
import { useDeleteProductTagMutation, useGetProductTagsQuery } from "../../services/api/productTagsApi";
import FlatProductTagCard from "../../components/FlatProductTagCard";
import AdminPanel from '../../layouts/AdminPanel';
import Page from "../../layouts/Page";
import "./product-tag-management.scss";
import { useNavigate } from "react-router-dom";

export default function AdminProductTagManagement() {
  const { data: productTags = [] } = useGetProductTagsQuery();
  const [ deleteProductTag ] = useDeleteProductTagMutation();

  const {
    selections,
    deselectAllSelections,
    handleSelectionEvent
  } = useFlatElementSelection(productTags, {
    identifier: (productTag) => productTag.id,
  });

  const navigate = useNavigate();

  const redirectToProductTagInspector = () => {
    if (selections.length === 1) {
      navigate(`/products/${selections[0].id}/inspect`);
      return;
    }

    const url = new URL(`/product-tags/inspect`, window.location.origin);
    for (const selection of selections) {
      url.searchParams.append('target', selection.id);
    }
    navigate(url);
  }

  const deleteSelectedTags = async () => {
    for (const selection of selections) {
      try {
        await deleteProductTag(selection.id).unwrap();
      } catch {}
    }
  }

  const defaultHeaderTools = (
    <>
      <button className="panel-tool highlight" onClick={() => navigate('/product-tags/create')}>New Tag</button>
    </>
  );

  const selectionHeaderTools = (
    <>
      <button className="panel-tool edit highlight" onClick={() => navigate(`/product-tags/${selections[0].id}/inspect`)}>Edit</button>
      <button className="panel-tool delete" onClick={deleteSelectedTags}>Delete</button>
    </>
  );

  return (
    <Page id='admin-product-tag-management' onClick={deselectAllSelections}>
      <AdminPanel
        title="Tag Management"
        headerTools={selections.length === 0 ? defaultHeaderTools : selectionHeaderTools}
      >
        {productTags.map(productTag => 
          <FlatProductTagCard 
            key={productTag.id}
            onClick={handleSelectionEvent(productTag)}
            className={selections.some(selection => selection === productTag) ? 'selected' : ''} 
            productTag={productTag} 
          />
        )}
      </AdminPanel>
    </Page>
  );
}