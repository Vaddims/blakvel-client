import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagField, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import './product-tag-field-inspection.scss';
import { useProductTagInspector } from "../../middleware/component-hooks/product-tag-inspector/useProductTagInspector";
import { useCreateProductTagMutation } from "../../services/api/productsApi";
import { LocationState } from "../../models/location-state.model";
import { StaticRoutes } from "../../middleware/utils/static-routes.enum";


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
  const productTagInspector = useProductTagInspector();

  const navigate = useNavigate();
  const location = useLocation();
  const locationState: LocationState = location.state ?? {}
  const { 
    awaitingPreviousPaths = [],
  } = locationState;

  const requestProductTagCreation = async () => {
    try {
      const inputProductTag = productTagInspector.validateInputs();
      await createProductTag({
        ...inputProductTag,
      });

      const path = awaitingPreviousPaths?.[awaitingPreviousPaths.length - 1] ?? StaticRoutes.ProductTagManagement;
      const newLocationState: LocationState = {
        ...locationState,
        awaitingPreviousPaths: awaitingPreviousPaths.slice(0, -2),
      }

      navigate(path, { replace: true, state: newLocationState });
    } catch {}
  }

  const headerTools = (
    <>
      <button className="panel-tool" onClick={productTagInspector.createField}>Add field</button>
      <button className="panel-tool highlight" onClick={requestProductTagCreation}>Create</button>
    </>
  );

  return (
    <Page id="create-product-tag">
      <Panel title="Create New Product Tag" headerTools={headerTools}>
        <div className="product-tag-details">
          { productTagInspector.render() }
        </div>
      </Panel>
    </Page>
  )
}