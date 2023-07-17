import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { ProductTagFieldBundle, ProductTagFieldInspection } from "./ProductTagFieldInspection";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import * as uuid from 'uuid';
import './product-tag-field-inspection.scss';
import { useProductTagInspector } from "../../middleware/component-hooks/product-tag-inspector/useProductTagInspector";
import { LocationState } from "../../models/location-state.model";
import { StaticRoutes } from "../../middleware/utils/static-routes.enum";
import { useGetProductTagQuery, useUpdateProductTagMutation } from "../../services/api/coreApi";

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
      <Panel title="Inspecting One Tag" headerTools={headerTools} displayBackNavigation>
        <div className="product-tag-details">
          { productTagInspector.render() }
        </div>
      </Panel>
    </Page>
  )
}