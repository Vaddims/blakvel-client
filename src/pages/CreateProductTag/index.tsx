import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagField, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useCreateProductTagMutation } from "../../services/api/productTagsApi";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import './product-tag-field-inspection.scss';
import { ProductTagFieldDeclaration } from "../../models/product-tag-field-declaration.model";

interface ContextState {
  name: string;
  fields: [],
}

const initialContextState = {
  name: '',
  fields: [],
}

export const ProductTagContext = createContext({ ...initialContextState });

export const CreateProductTag = () => {
  const [ createProductTag ] = useCreateProductTagMutation();
  const navigate = useNavigate();

  const [ productTagName, setProductTagName ] = useState('');
  const [ fields, setFields ] = useState<ProductTagFieldDeclaration[]>([]);

  const requestProductCreation = async () => {
    try {
      const product = await createProductTag({
        name: productTagName,
        fields: fields,
      }).unwrap();
      
      navigate(`/product-tags/${product.id}/inspect`);
    } catch {}
  }

  const headerTools = (
    <>
      <button className="panel-tool highlight" onClick={requestProductCreation}>Create</button>
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
    <Page id="create-product-tag">
      <Panel title="Create New Product Tag" headerTools={headerTools}>
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