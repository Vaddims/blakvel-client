import { faBoxes, faCalendarMinus, faDollar, faHashtag, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { InputFieldDatalistElement } from "../../../components/TextInputField";
import { useProductImageShowcaseEditor } from "../../../components/ProductImageEditor/useProductImageShowcaseEditor";
import { Product } from "../../../models/product.model";
import { InputFieldStatusDescriptor } from "../../../pages/InspectProduct";
import { ProductTagRepresenter } from "../../../pages/InspectProduct/ProductTagRepresenter";
import { productsApi, useGetProductQuery, useGetProductTagsQuery } from "../../../services/api/productsApi";
import useCheckboxField from "../../hooks/checkbox-field-hook";
import useSelectInputField from "../../hooks/select-input-field-hook";
import statusSelections from './status.selection.json';
import useTextareaInput from "../../hooks/textarea-input-field-hook";
import * as uuid from 'uuid';
import './product-inspector.scss';
import { InputField, InputFieldError, validateComponentStateInputs } from "../../hooks/input-field-hook";
import useTextInputField from "../../hooks/text-input-field-hook";
import useInputFieldCollection, { InputFieldCollection } from "../../hooks/use-input-field-collection-hook";
import SubProductTagInspector from "./SubProductTagInspector";

interface ProductInspectorOptions {
  readonly productId?: string;
  readonly disableSkeletonLayout?: boolean;
}

const discountPriceValidator = (discountInput: string, priceResult: InputField.State.ValidationResult<any>) => {
  if (discountInput.trim() === '') {
    throw new InputFieldError('Input is empty')
  }

  const discount = Number(discountInput);
  if (Number.isNaN(discount)) {
    throw new InputFieldError('Input is not a number');
  }

  if (discount < 0) {
    throw new InputFieldError(`Price can't be negative`);
  }

  if (!priceResult.isValid) {
    return discount;
  }

  if (discount > priceResult.data) {
    throw new InputFieldError(`Discount can't be higher than the price`);
  }

  if (discount === priceResult.data) {
    throw new InputFieldError(`Discount can't be equal to the price`);
  }

  return discount;
}

export const useProductInspector = (options?: ProductInspectorOptions) => {
  const productId = options?.productId ?? '';
  const productIdProvided = typeof options?.productId === 'string';

  const { data: product } = useGetProductQuery(productId, { skip: !productIdProvided });
  const { data: globalProductTags } = useGetProductTagsQuery();
  const [ draftProductTags, setDraftProductTags ] = useState<Product.Tag[]>(product?.tags ?? []);

  const removeDraftProductTag = (id: string) => {
    setDraftProductTags((productTags) => {
      const newProductTags = productTags.filter(productTag => productTag.id !== id);
      return newProductTags;
    });
  }

  useEffect(() => {
    if (product) {
      applyProductValues(product);
    }
  }, [product]);

  const nameInput = useTextInputField({
    label: 'Name',
    required: true,
    value: product?.name,
    anchor: product?.name,
    trackValue: true,
    trackAnchor: true,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => {
      if (input.trim() === '') {
        throw new InputFieldError('Name not provided');
      }

      return input;
    }
  });

  const priceInput = useTextInputField<number>({
    label: 'Price',
    required: true,
    value: product?.price.toString(),
    anchor: product?.price.toString(),
    trackValue: true,
    trackAnchor: true,
    inputIcon: faDollar,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => {
      if (input.trim() === '') {
        throw new InputFieldError('Price not provided');
      }

      const number = Number(input);
      if (Number.isNaN(number)) {
        throw new InputFieldError('Input is not a number');
      }

      if (number < 0) {
        throw new InputFieldError(`Price can't be negative`);
      }

      return number;
    },
    onChange(data) {
      if (!discountCheckboxInput.value) {
        return;
      }

      const priceResult = priceInput.validateCustomValue(data, this.validate, true);
      if (priceResult.isValid) {
        const customDiscountPriceValidator = () => discountPriceValidator(discountPriceInput.value, priceResult);
        discountPriceInput.validateCustomValue(discountPriceInput.value, customDiscountPriceValidator);
      }
    },
  });

  const discountCheckboxInput = useCheckboxField({
    label: 'Use Discount',
    value: typeof product?.discountPrice === 'number',
    anchor: typeof product?.discountPrice === 'number',
    trackValue: true,
    trackAnchor: true,
  });

  const discountPriceInput = useTextInputField({
    label: 'Discount Price',
    value: product?.discountPrice?.toString(),
    anchor: product?.discountPrice?.toString(),
    trackValue: true,
    trackAnchor: true,
    inputIcon: faDollar,
    required: true,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate(input) {
      return discountPriceValidator(input, priceInput.validate(true));
    }, 
  });

  const discountExpirationDateInput = useTextInputField<Date | undefined>({
    label: 'Expiration Date',
    helperText: 'If an expiration date is not provided, the discount will remain active until it is manually changed.',
    inputIcon: faCalendarMinus,
    type: 'datetime-local',
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => {
      if (input === '') {
        return;
      }

      const date = new Date(input);

      if (Number.isNaN(date.getTime())) {
        throw new InputFieldError('Invalid date');
      }

      if (date.getTime() - Date.now() <= 0) {
        throw new InputFieldError('The expiration date must be in the feature')
      }

      return date;
    }
  });

  const descriptionInput = useTextareaInput({
    label: 'Description',
    value: product?.description,
    anchor: product?.description,
    trackValue: true,
    trackAnchor: true,
  });

  const stateSelectionInput = useSelectInputField({
    label: 'State',
    options: statusSelections,
    value: statusSelections.find(option => option.value === (product?.state ?? 'prepublic')),
    anchor: statusSelections.find(option => option.value === (product?.state ?? 'prepublic')),
    trackValue: true,
    trackAnchor: true,
    required: true,
  });

  const physicalIdInput = useTextInputField({
    label: 'Physical ID',
    value: product?.physicalId,
    anchor: product?.physicalId,
    trackValue: true,
    trackAnchor: true,
  })

  const stockInput = useTextInputField({
    label: 'In Stock',
    required: true,
    value: product?.stock.toString(),
    anchor: product?.stock.toString(),
    trackValue: true,
    trackAnchor: true,
    labelIcon: faBoxes,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => {
      if (input.trim() === '') {
        throw new InputFieldError('Price not provided');
      }

      const number = Number(input);
      if (Number.isNaN(number)) {
        throw new InputFieldError('Input is not a number');
      }

      if (number < 0) {
        throw new InputFieldError(`Price can't be negative`);
      }

      return number;
    }
  });

  const tagSearchInput = useTextInputField<Product.Tag>({
    placeholder: 'Search for Tag',
    labelIcon: faHashtag,
    inputIcon: faSearch,
    validationTimings: [InputField.ValidationTiming.Submit],
    validate: (input) => {
      const uniFormattedInput = input.toUpperCase().trim();
      const targetTag = globalProductTags?.find(globalProductTag => (
        globalProductTag.name.toUpperCase() === uniFormattedInput
      ));

      if (!targetTag) {
        throw new InputFieldError(`Tag (${input.toLocaleUpperCase()}) doesn't exist`);
      }
      
      const productHasTargetTag = draftProductTags.find(draftProductTag => draftProductTag.id === targetTag.id);
      if (productHasTargetTag) {
        throw new InputFieldError(`Tag with the name ${targetTag.name.toLocaleUpperCase()} is already added`);
      }

      return targetTag;
    },
    onSubmit(targetProductTag) {
      const newDraftProductTags = [targetProductTag, ...draftProductTags];
      setDraftProductTags(newDraftProductTags);
      tagSearchInput.restoreValue()
    }
  });

  const staticInputs = {
    nameInput, 
    priceInput, 
    stockInput, 
    descriptionInput, 
    physicalIdInput, 
    discountCheckboxInput,
    stateSelectionInput,
  };

  // TODO REWORK
  const imageEditor = useProductImageShowcaseEditor(product);

  // TODO Trasnfer somewhere else
  const calculateDiscountPercent = () => {
    const priceResult = priceInput.validate(true);
    const discountPriceResult = discountPriceInput.validate(true);

    if (!priceResult.isValid || !discountPriceResult.isValid) {
      return null;
    }

    const price = priceResult.data;
    const discountPrice = discountPriceResult.data;

    if (price < discountPrice) {
      return null;
    }

    const discountPercent = 100 - Math.round(discountPrice / price * 100);
    return discountPercent;
  }

  const applyProductValues = (targetProduct: Product) => {
    let shouldShowDiscount = true;
    const { discountPrice } = targetProduct;
    const expirationDate = targetProduct.discountExpirationDate 
      ? new Date(targetProduct.discountExpirationDate)
      : null;

    if (discountPrice) {
      if (expirationDate) {
        const expirationDatePassed = expirationDate.getTime() - Date.now() <= 0;
        if (expirationDatePassed) {
          shouldShowDiscount = false;
        } else {
          const offsetInMs = new Date().getTimezoneOffset() * 60 * 1000;
          const valueFormattedDateWithOffset = new Date(expirationDate.getTime() - offsetInMs).toISOString().replace('Z', '');
          discountExpirationDateInput.setValue(valueFormattedDateWithOffset, true);
        }
      }

      if (shouldShowDiscount) {
        discountCheckboxInput.setValue(true, true);
        discountPriceInput.setValue(discountPrice?.toString(), true);
      }
    }

    setDraftProductTags(targetProduct.tags);
    // setDraftProductSpecifications(targetProduct.specifications)
  }

  const restoreProductValues = () => {
    const staticInputsArray = Array.from(Object.values(staticInputs));
    staticInputsArray.forEach((input) => input.restoreValue());
    staticInputsArray.forEach(input => input.statusApplier.restoreDefault());
    
    setDraftProductTags(product?.tags ?? []);
    inputFieldCollection.restore();
  }

  const validateInputs = (): Omit<Product, 'id' | 'urn'> | null => {
    const validatedResults = validateComponentStateInputs(staticInputs);
    
    const discountPriceResult = validatedResults?.discountCheckboxInput.data 
    ? discountPriceInput.validate() 
    : void 0;

    const discountExpirationDateResult = validatedResults?.discountCheckboxInput.data 
    ? discountExpirationDateInput.validate()
    : void 0;

    const specificationResult = inputFieldCollection.validate();
    
    if (
      !validatedResults || 
      !discountPriceResult?.isValid ||
      !discountExpirationDateResult?.isValid ||
      !specificationResult.collectionIsValid
    ) {
      return null;
    }

    const specifications: Product.Specification[] = specificationResult.successes.map(result => ({
      field: result.field.payload,
      value: result.data as string,
    }))

    const product: Omit<Product, 'id' | 'urn'> = {
      name: validatedResults.nameInput.data,
      price: validatedResults.priceInput.data,
      creationDate: new Date().toString(),
      description: validatedResults.descriptionInput.data,
      physicalId: validatedResults.physicalIdInput.data,
      state: validatedResults.stateSelectionInput.data.value as Product['state'],
      discountPrice: discountPriceResult?.data ?? null,
      discountExpirationDate: discountExpirationDateResult?.data?.toString() ?? null,
      stock: validatedResults.stockInput.data,
      tags: draftProductTags,
      specifications,
    }

    return product;
  }

  const inputFieldCollection = useInputFieldCollection({
    descriptorUpdateDependencies: [product, draftProductTags],
    fieldDescriptors: draftProductTags.map<InputFieldCollection.Field.Descriptor<Product.Tag.Field>[]>((tag) => tag.fields.map((field) => ({
      fieldType: InputFieldCollection.FieldType.Text,
      identifier: field.id,
      label: field.name,
      placeholder: `ex. ${field.example}`,
      value: product?.specifications.find(spec => spec.field.id === field.id)?.value ?? '',
      anchor: product?.specifications.find(spec => spec.field.id === field.id)?.value ?? '',
      group: [tag.id, field.id],
      required: field.required,
      payload: field,
      validationTimings: [InputField.ValidationTiming.Blur],
      validate(_, data) {
        return data;
      }
    }))).flat() ?? [],
  });

  const discountPercent = calculateDiscountPercent();

  const render = () => (
    <div className='product-inspector-area'>
      <article className="product-image-showcase-editor">
        {imageEditor.render()}
      </article>
      <main className="product-information-panel">

        <section className="info-row">
          <header className="row-divider">
            General Information
            <hr className="divider" />
          </header>
          <div className="cluster">
            <article className="product-information-fields">
              { nameInput.render() }
              { descriptionInput.render() }
              { priceInput.render() }
              <div className='discount-information'>
                <header>
                  { discountCheckboxInput.render() }
                  { discountCheckboxInput.value && discountPercent !== null && (
                    <span className=''>-{discountPercent}%</span> 
                  )}
                </header>
                { discountCheckboxInput.value && (
                  <div className='discount-input-fields'>
                    {discountPriceInput.render()}
                    {discountExpirationDateInput.render()}
                  </div>
                ) }
              </div>
            </article>
            <article>
              { stateSelectionInput.render() }
              { physicalIdInput.render() }
              { stockInput.render() }
            </article>
          </div>
        </section>

        <section className="info-row">
          <header className="row-divider">
            Specifications
            <hr className="divider" />
          </header>
          <div className="cluster">
            <article className="product-tag-management">
              { tagSearchInput.render() }
              <div className="product-tag-cluster">
                { draftProductTags.map(draftProductTag => (
                  <SubProductTagInspector
                    productTag={draftProductTag}
                    removeProductTag={() => removeDraftProductTag(draftProductTag.id)}
                    specificationGroup={inputFieldCollection.createFieldGroup(draftProductTag.id)}
                  />
                )) }
              </div>
            </article>
            <article>
              [Unique specifications]
            </article>
          </div>
        </section>
        <section className="info-row">
          <header className="row-divider">
            Timelined Snapshots
            <hr className="divider" />
          </header>
          <div className="cluster">
            
          </div>
        </section>
      </main>
    </div>
  );

  return {
    render,
    restoreProductValues,
    validateInputs,
    imageEditor,
  }
}