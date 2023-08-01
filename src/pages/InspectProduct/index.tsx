import { useGetProductsQuery, useUpdateProductMutation } from "../../services/api/coreApi";
import { useNavigate, useParams } from "react-router-dom";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import './inspect-product.scss';
import { InputField } from "../../middleware/hooks/input-field-hook";
import useSearchParamState from "../../middleware/hooks/useSearchParamState";
import useProductInspector from "../../middleware/component-hooks/product-inspector/useProductInspector";
import { UpdateProductDto } from "../../dto/product/update-product.dto";

export interface InputFieldStatusDescriptor {
  readonly fieldId: string;
  readonly status: InputField.Status;
  readonly description?: string;
}

const InspectProduct = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const {
    paramCluster,
    urlSearchParams,
  } = useSearchParamState();
  
  const [ updateProduct ] = useUpdateProductMutation();

  const querySearchParams = new URLSearchParams(urlSearchParams);
  querySearchParams.set('format', 'admin');
  const { data: products } = useGetProductsQuery(querySearchParams.toString());

  const productInspector = useProductInspector({
    productIds: paramCluster.inspect.all,
  });
  
  const requestProductUpdate = async () => {
    if (!products) {
      return;
    }

    const inputProducts = productInspector.validateInputs();

    if (inputProducts.length === 0) {
      alert('something went wrong');
      return;
    }

    for (const inputProduct of inputProducts) {
      const updateRequestBody: UpdateProductDto & {id: string} = {
        ...inputProduct,
        discountExpirationDate: inputProduct.discountExpirationDate || null,
        id: inputProduct.id,

        tags: inputProduct.tags.map(tag => tag.id),
        specifications: inputProduct.specifications.map(specification => ({
          value: specification.value,
          fieldId: specification.field.id,
        })),
        seller: inputProduct.seller?.id ?? null,
      }
      
      await updateProduct(updateRequestBody);
    }

    if (inputProducts.length === 1) {
      await productInspector.imageEditor.uploadImages(inputProducts[0].id);
    }

    if (inputProducts.length === 1) {
      navigate(`/products/${inputProducts[0].id}`, { replace: true });
    } else {
      navigate(`/admin-panel/product-management`, { replace: true });
    }
  }

  const restoreInputsHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    productInspector.restoreProductValues();
  }

  const headerTools = (
    <>
      <button className="panel-tool outline-highlight" onMouseUp={restoreInputsHandler}>Restore</button>
      <button className="panel-tool highlight" onClick={requestProductUpdate}>Update</button>
    </>
  )

  const panelSubheader = [];

  if (products?.length === 1) {
    const prod = products[0];
    panelSubheader.push(
      (
        <span>ID: <span className="highlight">{ prod.id }</span></span>
      ),
      (
        <span>Creation Date: <span className="highlight">{ new Date(prod.creationDate).toLocaleString() }</span></span>
      )
    );
  }

  const inspectingProductIds = paramCluster.inspect.all;
  return (
    <Page id="inspect-product">
      <Panel
        title={`Inspecting ${inspectingProductIds.length === 1 ? 'product' : `${inspectingProductIds.length} products`}`}
        headerTools={headerTools}
        subheader={panelSubheader}
        displayBackNavigation
      >
        {productInspector.render()}
      </Panel>
    </Page>
  )
}

export default InspectProduct;