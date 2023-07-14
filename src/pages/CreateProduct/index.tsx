import { useNavigate } from "react-router-dom";
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel";
import { useCreateProductMutation } from "../../services/api/productsApi";
import useProductInspector from "../../middleware/component-hooks/product-inspector/useProductInspector";
import './createProduct.scss';

const CreateProduct: React.FC = () => {
  const [ createProduct ] = useCreateProductMutation();
  const productInspector = useProductInspector();
  const navigate = useNavigate();
  
  const requestProductCreation = async () => {
    const inputProduct = productInspector.validateInputs();
    const prod = inputProduct[0];
    if (!prod) {
      return;
    }

    const product = await createProduct({
      ...prod,
      tags: prod.tags.map(tag => tag.id),
      specifications: prod.specifications.map(spec => ({
        value: spec.value,
        fieldId: spec.field.id,
      })),
      seller: prod.seller?.id ?? null,
    } as any).unwrap();

    await productInspector.imageEditor.uploadImages(product.id);
    navigate(`/products/${product.id}`, { replace: true });
  }

  const headerTools = (
    <>
      <button className="panel-tool highlight" onClick={requestProductCreation}>Create</button>
    </>
  )
  
  return (
    <Page id="create-product">
      <Panel title="Create New Product" headerTools={headerTools} displayBackNavigation>
        { productInspector.render() }
      </Panel>
    </Page>
  )
}

export default CreateProduct;