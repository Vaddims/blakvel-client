import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from "react";
import { useGetProductQuery, useUpdateProductMutation } from "../../services/api/productsApi";
import { useProductImageShowcaseEditor } from '../../components/ProductImageEditor/useProductImageShowcaseEditor';
import { useNavigate, useParams } from "react-router-dom";
import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import * as uuid from 'uuid';
import './inspect-product.scss';
import { useGetProductTagsQuery } from "../../services/api/productTagsApi";
import { ProductTagRepresenter } from "./ProductTagRepresenter";
import { useInputFieldManagement, ValidationTiming } from "../../middleware/hooks/useInputFieldManagement";
import { InputFieldDatalistElement, InputStatus } from "../../components/InputField";
import { Product } from "../../models/product.model";
import { faBoxesStacked, faDollarSign, faHashtag, faHeading, faMoneyBill, faSignature, faTag } from "@fortawesome/free-solid-svg-icons";

export interface InputFieldStatusDescriptor {
  readonly fieldId: string;
  readonly status: InputStatus;
  readonly description?: string;
}

const InspectProduct = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const uuidIsValid = uuid.validate(id);
  
  const [ updateProduct ] = useUpdateProductMutation();

  const { data: product } = useGetProductQuery(id, { skip: !uuidIsValid });
  const { data: globalProductTags } = useGetProductTagsQuery();

  const [ draftProductTags, setDraftProductTags ] = useState<Product.Tag[]>(product?.tags ?? []);

  const [ 
    draftProductSpecifications, 
    setDraftProductSpecifications 
  ] = useState<Product.Specification[]>(product?.specifications ?? []);

  const [ 
    draftProductSpecificationStatusDescriptors,
    setDraftProductSpecificationStatusDescriptors
  ] = useState<InputFieldStatusDescriptor[]>((product?.specifications ?? []).map(spec => ({
    fieldId: spec.field.id,
    status: InputStatus.Default,
    description: '',
  })));

  const updateDraftProductSpecificationStatusDescriptor = (fieldId: string, status: InputStatus, description?: string) => {
    setDraftProductSpecificationStatusDescriptors(prevState => {
      const targetSpec = prevState.find(spec => spec.fieldId === fieldId);
  
      if (!targetSpec) {
        return [
          ...prevState,
          {
            fieldId,
            status,
            description: description ?? '',
          },
        ];
      }
  
      const newDraftProductSpecificationStatusDescriptors = prevState.filter(
        spec => spec.fieldId !== targetSpec.fieldId
      );
  
      return [
        ...newDraftProductSpecificationStatusDescriptors,
        {
          fieldId,
          status,
          description: description ?? targetSpec.description,
        },
      ];

      // TODO Overhaul to be memory save (delete descriptor when specification is deleted)
    });
  };

  const getUniqueTagDatalist = (targetProductTags: Product.Tag[]): InputFieldDatalistElement[] => {
    const unassignedTags = globalProductTags?.filter(globalProductTag => (
      !targetProductTags.find(productTag => productTag.name === globalProductTag.name)
    ));

    const unassignedTagDatalist = unassignedTags?.map(unassignedTag => ({
      name: unassignedTag.name,
      description: `${unassignedTag.fields.length} fields`
    }));

    return unassignedTagDatalist ?? [];
  }

  // Product name input management
  const productNameInputField = useInputFieldManagement({
    label: 'Name',
    required: true,
    format: (input) => {
      if (input.trim() === '') {
        throw new Error('Name not provided');
      }

      return input;
    }
  });

  // Product price input management
  const productPriceInputField = useInputFieldManagement({
    label: 'Price',
    required: true,
    format: (input) => {
      console.log(input, input.trim())
      if (input.trim() === '') {
        throw new Error('Price not provided');
      }

      const number = Number(input);
      if (Number.isNaN(number)) {
        throw new Error('Input is not a number');
      }

      if (number < 0) {
        throw new Error(`Price can't be negative`);
      }

      return number;
    }
  });

  // Product original price input management
  const productOriginalPriceInputField = useInputFieldManagement({
    label: 'Discount Price',
    format: (input) => {
      if (input.trim() === '') {
        return;
      }

      const number = Number(input);
      if (Number.isNaN(number)) {
        throw new Error('Input is not a number');
      }

      if (number < 0) {
        throw new Error(`Price can't be negative`);
      }

      return number;
    }
  });

  // Product stock input management
  const productStockInputField = useInputFieldManagement({
    label: 'In Stock',
    required: true,
    format: (input) => {
      if (input.trim() === '') {
        throw new Error('Price not provided');
      }

      const number = Number(input);
      if (Number.isNaN(number)) {
        throw new Error('Input is not a number');
      }

      if (number < 0) {
        throw new Error(`Price can't be negative`);
      }

      return number;
    }
  });

  // Product tag input mamangement
  const productTagSearchInputField = useInputFieldManagement<Product.Tag>({
    label: 'Search for Tag',
    labelIcon: faHashtag,
    validationTiming: ValidationTiming.OnBoth,
    format: (input) => {
      const targetTag = globalProductTags?.find(globalProductTag => globalProductTag.name === input);
      if (!targetTag) {
        throw new Error(`\`${input}\` tag doesn't exist`);
      }
      
      const productHasTargetTag = draftProductTags.find(draftProductTag => draftProductTag.id === targetTag.id);
      if (productHasTargetTag) {
        throw new Error(`\`${targetTag}\` tag is already added`);
      }

      return targetTag;
    },
    onSubmit(targetProductTag) {
      const newDraftProductTags = [targetProductTag, ...draftProductTags];
      setDraftProductTags(newDraftProductTags);
      productTagSearchInputField.setInputDatalist(getUniqueTagDatalist(newDraftProductTags));
      productTagSearchInputField.restoreInputValue()
    },
  });

  const {
    render: renderProductImageShowcaseEditor,
    uploadImages,
  } = useProductImageShowcaseEditor(product);

  const applyProductValues = (targetProduct: Product) => {
    productNameInputField.setInputValue(targetProduct.name, true);
    productPriceInputField.setInputValue(targetProduct.price.toString(), true);
    productOriginalPriceInputField.setInputValue(targetProduct.originalPrice?.toString() ?? '', true);
    productStockInputField.setInputValue(targetProduct.stock.toString(), true);
    productTagSearchInputField.setInputDatalist(getUniqueTagDatalist(targetProduct.tags));

    setDraftProductTags(targetProduct.tags);
    setDraftProductSpecifications(targetProduct.specifications)
  }

  const restoreProductValues = () => {
    productNameInputField.restoreInputValue()
    productPriceInputField.restoreInputValue()
    productOriginalPriceInputField.restoreInputValue()
    productStockInputField.restoreInputValue()

    setDraftProductTags(product?.tags ?? []);
    setDraftProductSpecifications(product?.specifications ?? []);
    setDraftProductSpecificationStatusDescriptors((product?.specifications ?? []).map(spec => ({
      fieldId: spec.field.id,
      status: InputStatus.Default,
      description: '',
    })))
  }

  const updateSpecification = (field: Product.Tag.Field): React.ChangeEventHandler<HTMLInputElement> => (event) => {
    updateDraftProductSpecificationStatusDescriptor(field.id, InputStatus.Default, '');
    const specificationIndex = draftProductSpecifications.findIndex(draftSpecification => draftSpecification.field.id === field.id);
    const newDraftProductSpecification = [...draftProductSpecifications];
    
    if (specificationIndex >= 0) {
      newDraftProductSpecification.splice(specificationIndex, 1);
    }

    newDraftProductSpecification.push({
      field: field,
      value: event.target.value,
    });

    setDraftProductSpecifications(newDraftProductSpecification)
  }

  const blurSpecification = (field: Product.Tag.Field): React.FocusEventHandler<HTMLInputElement> => (event) => {
    if (event.target.value === '') {
      return;
    }

    const t = product?.specifications.find(spec => spec.field.id === field.id);
    if (t && event.target.value === t.value) {
      return;
    }

    updateDraftProductSpecificationStatusDescriptor(field.id, InputStatus.Valid, '');
  }

  const click = (field: Product.Tag.Field): React.MouseEventHandler<HTMLInputElement> => (event) => {
    updateDraftProductSpecificationStatusDescriptor(field.id, InputStatus.Default, '');
  }

  const restoreTagSpecifications = (tag: Product.Tag) => {
    setDraftProductSpecifications(prevState => {
      const clear = prevState.filter(spec => !tag.fields.some(field => field.id === spec.field.id));
      for (const field of tag.fields) {
        const target = product?.specifications.find(s => field.id === s.field.id);
        clear.push({
          field,
          value: target?.value ?? '',
        });
        updateDraftProductSpecificationStatusDescriptor(field.id, InputStatus.Default, '');
      }

      return clear;
    });
  }

  useEffect(() => {
    if (!product) {
      return;
    }

    applyProductValues(product);
  }, [product]);
  
  const requestProductUpdate = async () => {
    if (!product) {
      return;
    }

    try {
      const name = productNameInputField.validateInput();
      const price = productPriceInputField.validateInput();
      const originalPrice = productOriginalPriceInputField.validateInput();
      const stock = productStockInputField.validateInput();

      let specificationInputsAreInvalid = false;
      const definedSpecifications: Product.Specification[] = [];
      for (const draftSpecification of draftProductSpecifications) {
        if (draftSpecification.value.trim() !== '') {
          definedSpecifications.push(draftSpecification);
          continue;
        }

        if (draftSpecification.field.required) {
          updateDraftProductSpecificationStatusDescriptor(draftSpecification.field.id, InputStatus.Invalid, 'No input')
          specificationInputsAreInvalid = true;
        }
      }

      if (specificationInputsAreInvalid) {
        throw new Error();
      }

      const formattedSpecifications = definedSpecifications.map(spec => ({
        fieldId: spec.field.id,
        value: spec.value,
      }))
      
      await updateProduct({
        id: product.id,
        name,
        price,
        originalPrice,
        stock,
        tags: draftProductTags.map(tag => tag.id),
        specifications: formattedSpecifications,
      } as any);

      await uploadImages(product.id);
      navigate(`/products/${product.id}`);
    } catch {}
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
        <article className="product-image-showcase-editor">
          {renderProductImageShowcaseEditor()}
        </article>
        <article className="product-information-fields">
          { productNameInputField.render() }
          { productPriceInputField.render() }
          { productOriginalPriceInputField.render() }
          { productStockInputField.render() }
        </article>
        <article className="product-tag-management">
          { productTagSearchInputField.render() }
          <div className="product-tag-cluster">
            {draftProductTags?.map(productTag => (
              <ProductTagRepresenter
                draftProductSpecificationStatusDescriptors={draftProductSpecificationStatusDescriptors}
                specifications={draftProductSpecifications}
                targetProductTag={productTag}
                draftProductTags={draftProductTags ?? []} 
                setProductTags={setDraftProductTags} 
                updateSpecification={updateSpecification}
                blurSpecification={blurSpecification}
                clickSpecification={click}
                restore={() => restoreTagSpecifications(productTag)}
              />
            ))}
          </div>
        </article>
      </Panel>
    </Page>
  )
}

export default InspectProduct;