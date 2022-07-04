import { useFlatElementSelection } from '../../middleware/hooks/useFlatElementSelection';
import { useDeleteProductMutation, useGetProductsQuery } from '../../services/api/productsApi';
import { Link, useNavigate } from 'react-router-dom';
import FlatProductCard from '../../components/FlatProductCard';
import AdminPanel from '../../layouts/AdminPanel';
import Page from '../../layouts/Page';
import './product-management.scss';

export default function AdminProductManagement() {  
  const navigate = useNavigate();
  const { data: products = [] } = useGetProductsQuery();
  const [ deleteProduct ] = useDeleteProductMutation();

  const { 
    selections,
    deselectAllSelections,
    handleSelectionEvent,
  } = useFlatElementSelection(products, {
    identifier: (product) => product.id,
  });

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

  return (
    <Page id='admin-product-management' onClick={deselectAllSelections}>
      <AdminPanel title="Product Management" headerTools={headerTools}>
        {products.map(product => 
          <FlatProductCard 
            key={product.id}
            onClick={handleSelectionEvent(product)}
            className={selections.some(selection => selection === product) ? 'selected' : ''} 
            product={product} 
          />
        )}
      </AdminPanel>
    </Page>
  );
}