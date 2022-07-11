import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagField, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useCreateProductTagMutation, useGetProductTagQuery, useGetProductTagsQuery, useUpdateProductTagMutation } from "../../services/api/productTagsApi";
import { useNavigate, useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { ProductTagFieldDeclaration } from "../../models/product-tag-field-declaration.model";
import * as uuid from 'uuid';
import './product-tag-field-inspection.scss';

interface ContextState {
  name: string;
  fields: [],
}

const initialContextState = {
  name: '',
  fields: [],
}

export const ProductTagContext = createContext({ ...initialContextState });

export const InspectProductTag = () => {
  const { id = '' } = useParams();
  const { data: productTag } = useGetProductTagQuery(id, { skip: !uuid.validate(id) })
  const [ updateProductTag ] = useUpdateProductTagMutation();
  const navigate = useNavigate();

  const [ productTagName, setProductTagName ] = useState('');
  const [ fields, setFields ] = useState<ProductTagFieldDeclaration[]>([]);

  useEffect(() => {
    if (!productTag) {
      return;
    }

    setProductTagName(productTag.name);
    setFields(productTag.fields);
  }, [productTag]);

  const requestProductUpdate = async () => {
    if (!productTag) {
      return;
    }
    
    try {
      const product = await updateProductTag({
        id: productTag.id,
        name: productTagName,
        fields: fields,
      }).unwrap();
      
      navigate(`/product-tags/${product.id}/inspect`);
    } catch {}
  }

  const headerTools = (
    <>
      <button className="panel-tool highlight" onClick={requestProductUpdate}>Update</button>
    </>
  );


  const createField = () => {
    setFields([ ...fields, {
      name: '',
      required: false,
      example: '',
    } ]);
  }
  
  const updateField = (index: number) => (field: ProductTagField) => {
    const modifiedFields = [...fields];
    modifiedFields[index] = field;
    setFields(modifiedFields);
  }
  
  return (
    <Page id="inspect-product-tag">
      <Panel title="Inspecting One Tag" headerTools={headerTools}>
        <div className="product-tag-details">
          <div className="product-tag-static-field">
            <span>Tag Name: </span>
            <input type="text" defaultValue={productTagName} onChange={(event) => setProductTagName(event.target.value)} className='tag-title' />
          </div>
          <div className="product-tag-dynamic-fields">
            <ProductTagContext.Provider value={{ ...initialContextState }}>
              {fields.map((field, index) => 
                <ProductTagFieldInspection
                  key={index}
                  field={field}
                  updateField={updateField(index)} 
                />
              )}
            </ProductTagContext.Provider>
          </div>
          <div className="product-tag-field-adder">
            <button className="product-tag-field-adder-button" onClick={createField}>Add field</button>
          </div>
        </div>
      </Panel>
    </Page>
  )
}