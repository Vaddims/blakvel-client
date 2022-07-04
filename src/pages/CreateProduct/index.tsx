import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductImageShowcaseInspector, ProductImageShowcaseInspectorRefMethods } from "../../components/ProductImageEditor";
import { useProductImageShowcaseEditor } from "../../components/ProductImageEditor/useProductImageShowcaseEditor";
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel";
import { useCreateProductMutation } from "../../services/api/productsApi";
import './createProduct.scss';

const CreateProduct: React.FC = () => {
  const [ createProduct ] = useCreateProductMutation();
  const {
    render,
    uploadImages,
  } = useProductImageShowcaseEditor();
  const navigate = useNavigate();
  const [productNameInput, setProductNameInput] = useState('');
  const [productPriceInput, setProductPriceInput ] = useState(0);
  const [productOriginalPrice, setProductOriginalPriceInput] = useState<number | null>(null);
  const [productStockInput, setProductStockInput] = useState(0);
  
  const requestProductCreation = async () => {
    try {
      const product = await createProduct({
        name: productNameInput,
        price: productPriceInput,
        originalPrice: productOriginalPrice,
        stock: productStockInput,
      }).unwrap();

      await uploadImages(product.id);
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
        {/* <ProductImageShowcaseInspector ref={galleryRef} /> */}
        {render()}
        <div className="product-details">
          <div className="product-static-field">
            <span>Name: </span>
            <input type="text" defaultValue={productNameInput} onChange={(e) => setProductNameInput(e.target.value)} className="changed" alt="" id="" />
          </div>
          <div className="product-static-field">
            <span>Price: </span>
            <input type="number" className="changed"  placeholder="price" defaultValue={productPriceInput} onChange={(e) => setProductPriceInput(Number(e.target.value))} />
          </div>
          <div className="product-static-field">
            <span>Original Price:</span>
            <input type="number" className="changed"  placeholder="original price" defaultValue={productOriginalPrice ?? ''} onChange={(e) => setProductOriginalPriceInput(e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div className="product-static-field">
            <span>Stock</span>
            <input className="changed"  type="text" placeholder="stock" defaultValue={productStockInput} onChange={(e) => setProductStockInput(Number(e.target.value))} />
          </div>
        </div>
      </Panel>
    </Page>
  )
}

export default CreateProduct;