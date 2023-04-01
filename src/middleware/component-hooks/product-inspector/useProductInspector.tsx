import { faDollar, faHashtag, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { InputFieldDatalistElement, InputStatus } from "../../../components/InputField";
import { useProductImageShowcaseEditor } from "../../../components/ProductImageEditor/useProductImageShowcaseEditor";
import { Product } from "../../../models/product.model";
import { InputFieldStatusDescriptor } from "../../../pages/InspectProduct";
import { ProductTagRepresenter } from "../../../pages/InspectProduct/ProductTagRepresenter";
import { useGetProductQuery } from "../../../services/api/productsApi";
import { composedValueAbordSymbol, InputFieldManagementHook, useInputFieldManagement, ValidationTiming } from "../../hooks/useInputFieldManagement";
import * as uuid from 'uuid';
import { useGetProductTagsQuery } from "../../../services/api/productTagsApi";
import './product-inspector.scss';


interface ProductInspectorOptions {
  readonly productId?: string;
  readonly disableSkeletonLayout?: boolean;
}

export const useProductInspector = (options?: ProductInspectorOptions) => {
  const {
    productId = '',
  } = options ?? {};

  const uuidIsValid = uuid.validate(productId);

  const { data: product } = useGetProductQuery(productId, { skip: !uuidIsValid });
  const { data: globalProductTags } = useGetProductTagsQuery();

  const [ draftProductTags, setDraftProductTags ] = useState<Product.Tag[]>(product?.tags ?? []);


  useEffect(() => {
    if (!product) {
      return;
    }

    applyProductValues(product);
  }, [product]);

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
    inputIcon: faDollar,
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
    },
  });

  // Product original price input management
  const productDiscountPriceInputField = useInputFieldManagement({
    label: 'Discount Price',
    inputIcon: faDollar,
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

  const genericInformationFields = [
    productNameInputField,
    productPriceInputField,
    productDiscountPriceInputField,
    productStockInputField,
  ] as const;

  // Product tag input mamangement
  const productTagSearchInputField = useInputFieldManagement<Product.Tag>({
    label: 'Search for Tag',
    labelIcon: faHashtag,
    inputIcon: faSearch,
    validationTimings: [ValidationTiming.OnBlur, ValidationTiming.OnChange],
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

  const imageEditor = useProductImageShowcaseEditor(product);

  const applyProductValues = (targetProduct: Product) => {
    productNameInputField.setInputValue(targetProduct.name, true);
    productPriceInputField.setInputValue(targetProduct.price.toString(), true);
    productDiscountPriceInputField.setInputValue(targetProduct.discountPrice?.toString() ?? '', true);
    productStockInputField.setInputValue(targetProduct.stock.toString(), true);
    productTagSearchInputField.setInputDatalist(getUniqueTagDatalist(targetProduct.tags));

    setDraftProductTags(targetProduct.tags);
    setDraftProductSpecifications(targetProduct.specifications)
  }

  const restoreProductValues = () => {
    productNameInputField.restoreInputValue()
    productPriceInputField.restoreInputValue()
    productDiscountPriceInputField.restoreInputValue()
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

  const validateInputs = (): Omit<Product, 'id' | 'urn'> => {
    const name = productNameInputField.getValidatedInputResult();
    const price = productPriceInputField.getValidatedInputResult();
    const discountPrice = productDiscountPriceInputField.getValidatedInputResult();
    const stock = productStockInputField.getValidatedInputResult();
    
    let specificationInputsAreInvalid = false;
    const definedSpecifications: Product.Specification[] = [];

    const productTagFields = draftProductTags.map(tag => tag.fields).flat();
    for (const tagField of productTagFields) {
      const draftSpecification = draftProductSpecifications.find(specification => specification.field.id === tagField.id);

      if (!draftSpecification) {
        if (tagField.required) {
          updateDraftProductSpecificationStatusDescriptor(tagField.id, InputStatus.Invalid, 'Field is required')
          continue;
        }

        continue;
      }

      if (draftSpecification.value !== '' as const) {
        definedSpecifications.push(draftSpecification);
        continue;
      }

      if (draftSpecification.field.required) {
        updateDraftProductSpecificationStatusDescriptor(draftSpecification.field.id, InputStatus.Invalid, 'Field is required')
        specificationInputsAreInvalid = true;
      }
    }


    if (
      name === composedValueAbordSymbol ||
      price === composedValueAbordSymbol ||
      discountPrice === composedValueAbordSymbol ||
      stock === composedValueAbordSymbol ||
      specificationInputsAreInvalid
    ) {
      throw new Error();
    }

    const product: Omit<Product, 'id' | 'urn'> = {
      name,
      price,
      discountPrice: discountPrice ?? null,
      stock,
      tags: draftProductTags,
      specifications: definedSpecifications,
    }

    return product;
  }

  const render = () => (
    <Fragment>
      <article className="product-image-showcase-editor">
        {imageEditor.render()}
      </article>
      <article className="product-information-fields">
        { productNameInputField.render() }
        { productPriceInputField.render() }
        { productDiscountPriceInputField.render() }
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
    </Fragment>
  );

  return {
    render,
    restoreProductValues,
    validateInputs,
    imageEditor,
  }
}