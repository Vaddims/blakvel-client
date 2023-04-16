import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from "react";
import { useGetProductQuery, useUpdateProductMutation } from "../../services/api/productsApi";
import { useProductImageShowcaseEditor } from '../../components/ProductImageEditor/useProductImageShowcaseEditor';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import * as uuid from 'uuid';
import './inspect-product.scss';
import { ProductTagRepresenter } from "./ProductTagRepresenter";
import { useInputFieldManagement, ValidationTiming } from "../../middleware/hooks/useInputFieldManagement";
import { InputFieldDatalistElement, InputStatus } from "../../components/InputField";
import { Product } from "../../models/product.model";
import { faBoxesStacked, faDollarSign, faHashtag, faHeading, faMoneyBill, faSignature, faTag } from "@fortawesome/free-solid-svg-icons";
import { useProductInspector } from "../../middleware/component-hooks/product-inspector/useProductInspector";

export interface InputFieldStatusDescriptor {
  readonly fieldId: string;
  readonly status: InputStatus;
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

    try {
      const inputProduct = productInspector.validateInputs();

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
    } catch {}
  }

  const headerTools = (
    <>
      <button className="panel-tool outline-highlight" onClick={productInspector.restoreProductValues}>Restore</button>
      <button className="panel-tool highlight" onClick={requestProductUpdate}>Update</button>
    </>
  )

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <Page id="inspect-product">
      <Panel
        title={`Inspecting one product`}
        headerTools={headerTools}
      >
        {productInspector.render()}
      </Panel>
    </Page>
  )
}

export default InspectProduct;