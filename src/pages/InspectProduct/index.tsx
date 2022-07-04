import { useEffect, useState } from "react";
import { useGetProductQuery, useUpdateProductMutation } from "../../services/api/productsApi";
import { useProductImageShowcaseEditor } from '../../components/ProductImageEditor/useProductImageShowcaseEditor';
import { useNavigate, useParams } from "react-router-dom";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import * as uuid from 'uuid';
import './inspect-product.scss';

const InspectProduct = () => {
  const { id = '' } = useParams();
  const { data: product } = useGetProductQuery(id, { skip: !uuid.validate(id) });
  const navigate = useNavigate();

  const [ updateProduct ] = useUpdateProductMutation();
  const [productNameInput, setProductNameInput] = useState<string>();
  const [productPriceInput, setProductPriceInput ] = useState<number>();
  const [productOriginalPrice, setProductOriginalPriceInput] = useState<number | null>(null);
  const [productStockInput, setProductStockInput] = useState<number>();

  const {
    render: renderProductImageShowcaseEditor,
    uploadImages,
  } = useProductImageShowcaseEditor(product);

  useEffect(() => {
    if (!product) {
      return;
    }

    setProductNameInput(product.name);
    setProductPriceInput(product.price);
    setProductOriginalPriceInput(product.originalPrice);
    setProductStockInput(product.stock);
  }, [product]);

  const restoreProductValues = () => {
    if (!product) {
      return;
    }

    setProductNameInput(product.name);
    setProductPriceInput(product.price);
    setProductOriginalPriceInput(product.originalPrice);
    setProductStockInput(product.stock);
  }
  
  const requestProductUpdate = async () => {
    if (!product) {
      return;
    }

    await updateProduct({
      id: product.id,
      name: productNameInput,
      price: productPriceInput,
      originalPrice: productOriginalPrice,
      stock: productStockInput,
    });

    await uploadImages(product.id);
    navigate(`/products/${product.id}`);
  }

  const headerTools = (
    <>
      <button className="panel-tool outline-highlight" onClick={restoreProductValues}>Restore</button>
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
        {renderProductImageShowcaseEditor()}
        <div className="product-details">
          <div className="product-static-field">
            <span>Name: </span>
            <input type="text" defaultValue={productNameInput} onChange={(e) => setProductNameInput(e.target.value)} className={product.name !== productNameInput ? "changed" : ""} alt="" id="" />
          </div>
          <div className="product-static-field">
            <span>Price: </span>
            <input type="number" className={product.price !== productPriceInput ? "changed" : ""}  placeholder="price" defaultValue={productPriceInput} onChange={(e) => setProductPriceInput(Number(e.target.value))} />
          </div>
          <div className="product-static-field">
            <span>Original Price:</span>
            <input type="number" className={product.originalPrice !== productOriginalPrice ? "changed" : ""}  placeholder="original price" defaultValue={productOriginalPrice ?? ''} onChange={(e) => setProductOriginalPriceInput(e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div className="product-static-field">
            <span>Stock</span>
            <input className={product.stock !== productStockInput ? "changed" : ""}  type="text" placeholder="stock" defaultValue={productStockInput} onChange={(e) => setProductStockInput(Number(e.target.value))} />
          </div>
        </div>
      </Panel>
    </Page>
  )
}

export default InspectProduct;