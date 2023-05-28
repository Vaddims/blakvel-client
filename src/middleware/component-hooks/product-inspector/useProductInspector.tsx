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
import useAppTextareaComponent from "../../hooks/textarea-input-field-hook";
import * as uuid from 'uuid';
import './product-inspector.scss';
import { InputField, InputFieldError, validateComponentStateInputs } from "../../hooks/input-field-hook";
import useTextInputField from "../../hooks/text-input-field-hook";

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

  useEffect(() => {
    if (product) {
      applyProductValues(product);
    }
  }, [product]);


  // TODO REWORK
  const [ 
    draftProductSpecifications, 
    setDraftProductSpecifications 
  ] = useState<Product.Specification[]>(product?.specifications ?? []);

  const [ 
    draftProductSpecificationStatusDescriptors,
    setDraftProductSpecificationStatusDescriptors
  ] = useState<InputFieldStatusDescriptor[]>((product?.specifications ?? []).map(spec => ({
    fieldId: spec.field.id,
    status: InputField.Status.Default,
    description: '',
  })));

  const updateDraftProductSpecificationStatusDescriptor = (fieldId: string, status: InputField.Status, description?: string) => {
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

  const getProductSpecificationInitialState = (specFieldId: string) => {
    return product?.specifications?.find(spec => spec.field.id === specFieldId);
  }
  // TODO REWORK END

  const nameInput = useTextInputField({
    label: 'Name',
    required: true,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => {
      if (input.trim() === '') {
        throw new InputFieldError('Name not provided');
      }

      return input;
    }
  });

  const priceInput = useTextInputField({
    label: 'Price',
    required: true,
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
  });

  const discountPriceInput = useTextInputField({
    label: 'Discount Price',
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

  const descriptionInput = useAppTextareaComponent({
    label: 'Description',
  })

  const stateSelectionInput = useSelectInputField({
    label: 'State',
    options: statusSelections,
    value: statusSelections.find(option => option.value === 'prepublic'),
    required: true,
  });

  const physicalIdInput = useTextInputField({
    label: 'Physical ID',
  })

  const stockInput = useTextInputField({
    label: 'In Stock',
    required: true,
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
    label: 'Add Tag',
    placeholder: 'Search',
    labelIcon: faHashtag,
    inputIcon: faSearch,
    validationTimings: [InputField.ValidationTiming.Submit],
    validate: (input) => {
      const uniFormattedInput = input.toUpperCase().trim();
      const targetTag = globalProductTags?.find(globalProductTag => (
        globalProductTag.name.toUpperCase() === uniFormattedInput
      ));

      if (!targetTag) {
        throw new InputFieldError(`Tag with the name ${input.toLocaleUpperCase()} doesn't exist`);
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
      // productTagSearchInput.setInputDatalist(getUniqueTagDatalist(newDraftProductTags));
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
    nameInput.setValue(targetProduct.name, true);
    descriptionInput.setValue(targetProduct.description, true);
    priceInput.setValue(targetProduct.price.toString(), true);
    physicalIdInput.setValue(targetProduct.physicalId, true);
    stockInput.setValue(targetProduct.stock.toString(), true);

    const stateSelecitonOption = statusSelections.find(option => option.value === targetProduct.state);
    stateSelectionInput.setValue(stateSelecitonOption ?? stateSelectionInput.defaultOption, true);

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
    setDraftProductSpecifications(targetProduct.specifications)
  }

  const restoreProductValues = () => {
    const staticInputsArray = Array.from(Object.values(staticInputs));
    staticInputsArray.forEach((input) => input.restoreValue());
    staticInputsArray.forEach(input => input.statusApplier.restoreDefault());
    
    setDraftProductTags(product?.tags ?? []);
    setDraftProductSpecifications(product?.specifications ?? []);
    setDraftProductSpecificationStatusDescriptors((product?.specifications ?? []).map(spec => ({
      fieldId: spec.field.id,
      status: InputField.Status.Default,
      description: '',
    })))
  }

  const updateSpecification = (field: Product.Tag.Field): React.ChangeEventHandler<HTMLInputElement> => (event) => {
    updateDraftProductSpecificationStatusDescriptor(field.id, InputField.Status.Default, '');
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

    updateDraftProductSpecificationStatusDescriptor(field.id, InputField.Status.Default);
  }

  const click = (field: Product.Tag.Field): React.MouseEventHandler<HTMLInputElement> => (event) => {
    updateDraftProductSpecificationStatusDescriptor(field.id, InputField.Status.Default, '');
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
        updateDraftProductSpecificationStatusDescriptor(field.id, InputField.Status.Default, '');
      }

      return clear;
    });
  }

  const restoreTagSpecification = (specFieldId: string) => {
    setDraftProductSpecifications(prevState => {
      const a: Product.Specification[] = [];
      for (const spec of prevState) {
        if (spec.field.id !== specFieldId) {
          a.push(spec);
          continue;
        }

        const init = getProductSpecificationInitialState(spec.field.id);
        if (!init) {
          const s = {
            field: spec.field,
            value: '',
          }

          a.push(s);
          continue
        }

        const s: Product.Specification = {
          ...init,
        }

        a.push(s);
      }

      return a;
    })
  }

  const clearTagSpecification = (specFieldId: string) => {
    setDraftProductSpecifications(prevState => {
      const a: Product.Specification[] = [];
      for (const spec of prevState) {
        if (spec.field.id !== specFieldId) {
          a.push(spec);
          continue;
        }

        const init = getProductSpecificationInitialState(spec.field.id);
        if (!init) {
          const s = {
            field: spec.field,
            value: '',
          }

          a.push(s);
          continue
        }

        const s: Product.Specification = {
          ...spec,
          value: '',
        }

        a.push(s);
      }

      return a;
    })
  }

  const validateInputs = (): Omit<Product, 'id' | 'urn'> | null => {
    const validatedResults = validateComponentStateInputs(staticInputs);
    
    const discountPriceResult = validatedResults?.discountCheckboxInput.data 
    ? discountPriceInput.validate() 
    : void 0;

    const discountExpirationDateResult = validatedResults?.discountCheckboxInput.data 
    ? discountExpirationDateInput.validate()
    : void 0;

    let specificationInputsAreInvalid = false;
    const definedSpecifications: Product.Specification[] = [];

    const productTagFields = draftProductTags.map(tag => tag.fields).flat();
    for (const tagField of productTagFields) {
      const draftSpecification = draftProductSpecifications.find(specification => specification.field.id === tagField.id);

      if (!draftSpecification) {
        if (tagField.required) {
          updateDraftProductSpecificationStatusDescriptor(tagField.id, InputField.Status.Error, 'Field is required');
          specificationInputsAreInvalid = true;
          continue;
        }

        continue;
      }

      if (draftSpecification.value !== '' as const) {
        definedSpecifications.push(draftSpecification);
        continue;
      }

      if (draftSpecification.field.required) {
        updateDraftProductSpecificationStatusDescriptor(draftSpecification.field.id, InputField.Status.Error, 'Field is required')
        specificationInputsAreInvalid = true;
      }
    }
    
    if (
      !validatedResults || 
      !discountPriceResult?.isValid ||
      !discountExpirationDateResult?.isValid ||
      specificationInputsAreInvalid
    ) {
      return null;
    }

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
      specifications: definedSpecifications,
    }

    return product;
  }

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
                    restoreSpecification={restoreTagSpecification}
                    clearSpecification={clearTagSpecification}
                    getProductSpecificationInitialState={getProductSpecificationInitialState}
                  />
                ))}
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