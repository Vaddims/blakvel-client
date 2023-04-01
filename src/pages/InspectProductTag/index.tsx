import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagFieldBundle, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useCreateProductTagMutation, useGetProductTagQuery, useGetProductTagsQuery, useUpdateProductTagMutation } from "../../services/api/productTagsApi";
import { useNavigate, useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import * as uuid from 'uuid';
import './product-tag-field-inspection.scss';
import { InputField, InputStatus } from "../../components/InputField";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { Product } from "../../models/product.model";
import { UpdateProductTagRequest } from "../../models/update-product-tag-request.model";

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
  const { data: productTags = [] } = useGetProductTagsQuery();
  const { data: productTag } = useGetProductTagQuery(id, { skip: !uuid.validate(id) })
  const [ updateProductTag ] = useUpdateProductTagMutation();
  const navigate = useNavigate();

  const [ productNameInputStatus, setProductNameInputStatus ] = useState(InputStatus.Default);
  const [ productTagName, setProductTagName ] = useState('');
  const [ tagNameHelperText, setTagNameHelperText ] = useState('');
  const [ fields, setFields ] = useState<ProductTagFieldBundle[]>([]);

  useEffect(() => {
    if (!productTag) {
      return;
    }

    setProductTagName(productTag.name);
    setFields(productTag.fields.map<ProductTagFieldBundle>(field => ({...field, initialField: { ...field }})));
  }, [productTag]);

  const requestProductUpdate = async () => {
    if (!productTag) {
      return;
    }
    
    try {
      const product = await updateProductTag({
        id: productTag.id,
        name: productTagName,
        fields: fields.map(f => {
          delete f.initialField;
          return f as Product.Tag.Field;
        }),
      }).unwrap();
      
      navigate(`/product-tags/${product.id}/inspect`);
    } catch {}
  }

  const createField = () => {
    setFields([ ...fields, {
      name: '',
      required: false,
      example: '',
      initialField: undefined,
    } ]);
  }

  const headerTools = (
    <>
      <button className="panel-tool" onClick={createField}>Add field</button>
      <button className="panel-tool highlight" onClick={requestProductUpdate}>Update</button>
    </>
  );
  
  const updateField = (index: number) => (field: ProductTagFieldBundle) => {
    const modifiedFields = [...fields];
    modifiedFields[index] = field;
    setFields(modifiedFields);
  }

  const removeField = (index: number) => () => {
    const modifiedFields = [...fields];
    modifiedFields.splice(index, 1);
    setFields(modifiedFields);
  }

  const onInputBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    const newProductTagName = event.target.value;
    setProductTagName(newProductTagName)
    setTagNameHelperText('');

    if (newProductTagName.length === 0) {
      setProductNameInputStatus(InputStatus.Default);
      return;
    }

    if (productTag?.name === newProductTagName) {
      setProductNameInputStatus(InputStatus.Default);
      return;
    }

    const existingTag = productTags.find((tag) => tag.name.toLowerCase() === newProductTagName.trim().toLowerCase())
    if (existingTag) {
      setProductNameInputStatus(InputStatus.Invalid);
      setTagNameHelperText(`Tag with the name \`${existingTag.name}\` already exists`);
      return;
    }
    
    setProductNameInputStatus(InputStatus.Valid);
  }

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newProductTagName = event.target.value;
    setProductTagName(newProductTagName)
    setTagNameHelperText('');
    setProductNameInputStatus(InputStatus.Default);
  }
  
  return (
    <Page id="inspect-product-tag">
      <Panel title="Inspecting One Tag" headerTools={headerTools}>
        <div className="product-tag-details">
          <InputField 
            label="Tag Name" 
            labelIcon={faHashtag}
            helperText={tagNameHelperText}
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
                  fields={fields}
                  updateField={updateField(index)} 
                  removeField={removeField(index)}
                />
              )}
            </ProductTagContext.Provider>
          </div>
        </div>
      </Panel>
    </Page>
  )
}