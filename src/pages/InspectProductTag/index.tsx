import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagFieldBundle, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import * as uuid from 'uuid';
import './product-tag-field-inspection.scss';
import { InputField, InputStatus } from "../../components/InputField";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { Product } from "../../models/product.model";
import { UpdateProductTagRequest } from "../../models/update-product-tag-request.model";
import { useProductTagInspector } from "../../middleware/component-hooks/product-tag-inspector/useProductTagInspector";
import { LocationState } from "../../models/location-state.model";
import { StaticRoutes } from "../../middleware/utils/static-routes.enum";
import { useGetProductTagQuery, useUpdateProductTagMutation } from "../../services/api/productsApi";

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
  const uuidIsValid = uuid.validate(id);
  
  const [ updateProductTag ] = useUpdateProductTagMutation();
  const { data: productTag } = useGetProductTagQuery(id, { skip: !uuidIsValid });
  const productTagInspector = useProductTagInspector({ tagId: id });

  const navigate = useNavigate();
  const location = useLocation();
  const locationState: LocationState = location.state ?? {}
  const { 
    awaitingPreviousPaths = [],
  } = locationState;
  


  /* const [ updateProductTag ] = useUpdateProductTagMutation();
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

  // const requestProductUpdate = async () => {
  //   if (!productTag) {
  //     return;
  //   }
    
  //   try {
  //     const product = await updateProductTag({
  //       id: productTag.id,
  //       name: productTagName,
  //       fields: fields.map(f => {
  //         delete f.initialField;
  //         return f as Product.Tag.Field;
  //       }),
  //     }).unwrap();
      
  //     navigate(`/product-tags/${product.id}/inspect`);
  //   } catch {}
  // }
  
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
  } */

  const requestProductTagUpdate = async () => {
    if (!productTag) {
      return;
    }

    try {
      const inputProductTag = productTagInspector.validateInputs();
      await updateProductTag({
        ...inputProductTag,
        id: productTag.id,
      } as any);

      const path = awaitingPreviousPaths?.[awaitingPreviousPaths.length - 1] ?? StaticRoutes.ProductTagManagement;
      const newLocationState: LocationState = {
        ...locationState,
        awaitingPreviousPaths: awaitingPreviousPaths.slice(0, -2),
      }
      console.log(locationState)
      navigate(path, { replace: true, state: newLocationState });
    } catch {}
  }

  const headerTools = (
    <>
      <button className="panel-tool outline-highlight" onClick={productTagInspector.createField}>Add field</button>
      <button className="panel-tool highlight" onClick={requestProductTagUpdate}>Update</button>
    </>
  );
  
  return (
    <Page id="inspect-product-tag">
      <Panel title="Inspecting One Tag" headerTools={headerTools}>
        <div className="product-tag-details">
          { productTagInspector.render() }
        </div>
      </Panel>
    </Page>
  )
}