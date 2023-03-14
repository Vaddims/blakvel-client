import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagField, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useCreateProductTagMutation, useGetProductTagsQuery } from "../../services/api/productTagsApi";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import './product-tag-field-inspection.scss';
import { ProductTagFieldDeclaration } from "../../models/product-tag-field-declaration.model";
import { InputField, InputStatus } from "../../components/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faTrash } from "@fortawesome/free-solid-svg-icons";


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
  const { data: productTags = [] } = useGetProductTagsQuery();
  const [ createProductTag ] = useCreateProductTagMutation();
  const navigate = useNavigate();
  
  const [ productNameInputStatus, setProductNameInputStatus ] = useState(InputStatus.Default);
  const [ productTagName, setProductTagName ] = useState('');
  const [ fields, setFields ] = useState<ProductTagFieldDeclaration[]>([]);

  const requestProductCreation = async () => {
    const product = await createProductTag({
      name: productTagName,
      fields: fields,
    }).unwrap();

    navigate(`/product-tags/${product.id}/inspect`);
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

  const onInputBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {

  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newProductTagName = event.target.value;
    setProductTagName(newProductTagName)

    if (newProductTagName.length === 0) {
      setProductNameInputStatus(InputStatus.Default);
      return;
    }

    if (productTags.some((tag) => tag.name.toLowerCase() === newProductTagName.trim().toLowerCase())) {
      setProductNameInputStatus(InputStatus.Invalid);
      return;
    }
    
    setProductNameInputStatus(InputStatus.Valid);
  }
  
  return (
    <Page id="create-product-tag">
      <Panel title="Create New Product Tag" headerTools={headerTools}>
        <div className="product-tag-details">
          <InputField 
            name="Tag Name" 
            icon={faHashtag}
            status={productNameInputStatus}
            value={productTagName}
            onChange={onInputChange} 
            onBlur={onInputBlur}
          />
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