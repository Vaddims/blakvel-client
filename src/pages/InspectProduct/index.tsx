import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from "react";
import { useGetProductQuery, useUpdateProductMutation } from "../../services/api/productsApi";
import { useProductImageShowcaseEditor } from '../../components/ProductImageEditor/useProductImageShowcaseEditor';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import * as uuid from 'uuid';
import './inspect-product.scss';
import { useProductInspector } from "../../middleware/component-hooks/product-inspector/useProductInspector";
import { InputField } from "../../middleware/hooks/input-field-hook";

export interface InputFieldStatusDescriptor {
  readonly fieldId: string;
  readonly status: InputField.Status;
  readonly description?: string;
}

const InspectProduct = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const uuidIsValid = uuid.validate(id);
  
  const [ updateProduct ] = useUpdateProductMutation();
  const { data: product } = useGetProductQuery(id, { skip: !uuidIsValid });
  const productInspector = useProductInspector({
    productId: id,
  });
  
  const requestProductUpdate = async () => {
    if (!product) {
      return;
    }

    const inputProduct = productInspector.validateInputs();
    if (!inputProduct) {
      return;
    }

    await updateProduct({
      ...inputProduct,
      discountExpirationDate: inputProduct.discountExpirationDate || void 0,
      id: product.id,
      tags: inputProduct.tags.map(tag => tag.id),
      specifications: inputProduct.specifications.map(specification => ({
        value: specification.value,
        fieldId: specification.field.id,
      }))
    });

    await productInspector.imageEditor.uploadImages(product.id);
    navigate(`/products/${product.id}`, { replace: true });
  }

  const restoreProductHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    productInspector.restoreProductValues();
  }

  const headerTools = (
    <>
      <button className="panel-tool outline-highlight" onMouseUp={restoreProductHandler}>Restore</button>
      <button className="panel-tool highlight" onClick={requestProductUpdate}>Update</button>
    </>
  )

  if (!product) {
    return <div>Loading...</div>
  }

  const panelSubheader = [
    (
      <span>ID: <span className="highlight">{ product.id }</span></span>
    ),
    (
      <span>Creation Date: <span className="highlight">{ new Date(product.creationDate).toLocaleString() }</span></span>
    )
  ]

  return (
    <Page id="inspect-product">
      <Panel
        title={`Inspecting one product`}
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