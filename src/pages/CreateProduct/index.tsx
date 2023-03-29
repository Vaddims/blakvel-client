import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductImageShowcaseInspector, ProductImageShowcaseInspectorRefMethods } from "../../components/ProductImageEditor";
import { useProductImageShowcaseEditor } from "../../components/ProductImageEditor/useProductImageShowcaseEditor";
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel";
import { useProductInspector } from "../../middleware/component-hooks/product-inspector/useProductInspector";
import { useCreateProductMutation } from "../../services/api/productsApi";
import './createProduct.scss';

const CreateProduct: React.FC = () => {
  const [ createProduct ] = useCreateProductMutation();
  const productInspector = useProductInspector();
  const navigate = useNavigate();
  
  const requestProductCreation = async () => {
    try {
      const inputProduct = productInspector.validateInputs();

      const product = await createProduct({
        ...inputProduct,
        tags: inputProduct.tags.map(tag => tag.id),
        specifications: inputProduct.specifications.map(spec => ({
          value: spec.value,
          fieldId: spec.field.id,
        }))
      } as any).unwrap();

      await productInspector.imageEditor.uploadImages(product.id);
      navigate(`/products/${product.id}`);
    } catch {}
  }

  const headerTools = (
    <>
      <button className="panel-tool highlight" onClick={requestProductCreation}>Create</button>
    </>
  )
  
  return (
    <Page id="create-product">
      <Panel title="Create New Product" headerTools={headerTools}>
        { productInspector.render() }
      </Panel>
    </Page>
  )
}

export default CreateProduct;