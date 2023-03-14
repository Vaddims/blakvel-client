import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from "react";
import { useGetProductQuery, useUpdateProductMutation } from "../../services/api/productsApi";
import { useProductImageShowcaseEditor } from '../../components/ProductImageEditor/useProductImageShowcaseEditor';
import { useNavigate, useParams } from "react-router-dom";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import * as uuid from 'uuid';
import './inspect-product.scss';
import { useGetProductTagsQuery } from "../../services/api/productTagsApi";
import { ProductTag } from "../../models/product-tag.model";
import { ProductTagRepresenter } from "./ProductTagRepresenter";

export interface ProductSpecificationField {
  fieldId: string;
  value: string;
}

const InspectProduct = () => {
  const { id = '' } = useParams();
  const { data: product } = useGetProductQuery(id, { skip: !uuid.validate(id) });
  const { data: tags } = useGetProductTagsQuery();
  const navigate = useNavigate();

  const [ updateProduct ] = useUpdateProductMutation();
  const [productNameInput, setProductNameInput] = useState<string>();
  const [productPriceInput, setProductPriceInput ] = useState<number>();
  const [productOriginalPrice, setProductOriginalPriceInput] = useState<number | null>(null);
  const [productStockInput, setProductStockInput] = useState<number>();

  const [productTagInput, setProductTagInput] = useState('');
  const [productTags, setProductTags] = useState<ProductTag[]>([]);
  const [ productSpecificationFields, setProductSpecificationFields ] = useState<ProductSpecificationField[]>([]);

  useEffect(() => {
    if (product) {
      setProductTags(product.tags);
    }
  }, [product])

  const handleProductTagInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    setProductTagInput(event.target.value);
  }

  const handleProductTagAdd: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    const productTag = tags?.find(tag => tag.name === productTagInput);
    if (!productTag) {
      console.log('no such tag')
      return;
    }

    if (productTags?.find(tag => tag.name === productTag.name)) {
      console.log('already exists');
      return;
    }

    setProductTags([productTag, ...productTags]);
    setProductTagInput('');
  }

  // useEffect(() => {
  //   if (tags) {
  //     setProductTags(tags);
  //   }

  // }, [tags])

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

    const obj = {
      id: product.id,
      name: productNameInput,
      price: productPriceInput,
      originalPrice: productOriginalPrice,
      stock: productStockInput,
      addTags: productTags.filter(productTag => !product.tags.some(pt => pt.id === productTag.id)).map(pt => pt.id),
    }

    console.log(obj)

    await updateProduct(obj);

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
            <span className="product-static-field-title">Name: </span>
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
          <div className="product-static-field">
            <div className={`product-tag-add ${tags?.some(tag => tag.name === productTagInput) ? 'valid' : ''}`}>
              <input type="text" list="tag-list" value={productTagInput} placeholder="Search for tag" onChange={handleProductTagInputChange} onKeyDown={handleProductTagAdd} />
              <datalist id="tag-list">
                {tags?.filter(tag => !productTags.some(pt => pt.name === tag.name)).map(productTag => 
                  <option value={productTag.name} key={productTag.id}>
                    {productTag.fields.length} fields
                  </option>
                )}
              </datalist>
            </div>
            <div className="product-tag-cluster">
              {productTags?.map(productTag => <ProductTagRepresenter productTag={productTag} setSpecificationFields={setProductSpecificationFields} />)}
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </Panel>
    </Page>
  )
}

export default InspectProduct;