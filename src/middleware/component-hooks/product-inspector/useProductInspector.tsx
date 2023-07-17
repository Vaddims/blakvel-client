import { faBoxes, faCalendarMinus, faDollar, faEdit, faHashtag, faRotateLeft, faSearch, faTrash, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useProductImageShowcaseEditor } from "../../../components/ProductImageEditor/useProductImageShowcaseEditor";
import { Product } from "../../../models/product.model";
import { useGetProductTagsQuery, useGetProductsQuery } from "../../../services/api/coreApi";
import useCheckboxField from "../../hooks/checkbox-field-hook";
import useSelectInputField, { mixedValuesSelectInputFieldOption } from "../../hooks/select-input-field-hook";
import statusSelections from './status.selection.json';
import useTextareaInput from "../../hooks/textarea-input-field-hook";
import { InputField, InputFieldError, validateComponentStateInputs } from "../../hooks/input-field-hook";
import useTextInputField from "../../hooks/text-input-field-hook";
import useInputFieldCollection, { InputFieldCollection } from "../../hooks/use-input-field-collection-hook";
import SubProductTagInspector from "./SubProductTagInspector";
import useGravatarAvatar from "../../hooks/gravatar-avatar-hook";
import { User } from "../../../models/user.model";
import AvatarDisplayer from "../../../components/AvatarDisplayer";
import { useGetUsersQuery } from "../../../services/api/coreApi";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SequentialSection from "../../../layouts/SequentialSection";
import SequentialSectionContainer from "../../../layouts/SequentialSectionContainer";
import useUserSearchInputField from "../../hooks/user-search-input-field-hook";
import useProductTagSearchInputField from "../../hooks/product-tag-search-input-field-hook";
import { Writeable } from "../../utils/types";
import { CrossValueUnification, getCrossValueUnificationFactory } from "../../utils/cross-value-unification-status";
import { calculateDiscountPercent } from "../../utils/calculations.util";
import './product-inspector.scss';

interface ProductInspectorOptions {
  readonly productIds?: string[];
  readonly disableSkeletonLayout?: boolean;
}

export const useProductInspector = (options?: ProductInspectorOptions) => {
  const { productIds = [] } = options ?? {};

  const navigate = useNavigate();
  const { data: fetchedUsers = [] } = useGetUsersQuery();
  const { data: fetchedProductTags = [] } = useGetProductTagsQuery();

  const fetchSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams([['format', 'admin']]);
    for (const productId of productIds) {
      searchParams.append('target', productId);
    }

    return searchParams;
  }, [productIds.join()]);

  const { data: products = [] } = useGetProductsQuery(fetchSearchParams.toString(), { skip: productIds.length === 0 });
  const productDependencyString = products.map(product => product.id).join();

  // TODO Implement server data
  const [ productSellerAnchor, setProductSellerAnchor ] = useState<User.Manifest>();
  const [ productSeller, setProductSeller ] = useState<User.Manifest>();

  useEffect(() => {
    if (products.length === 1 && products[0].seller) {
      setProductSellerAnchor(products[0].seller);
      setProductSeller(products[0].seller);
    }
  }, [productDependencyString]);

  const getInitialDraftProductTags = () => {
    if (products.length !== 1) {
      return [];
    }

    return products.map(product => product.tags).flat();
  }

  const initialDraftProductTags = useMemo(getInitialDraftProductTags, [productDependencyString]);
  const [ draftProductTags, setDraftProductTags ] = useState<Product.Tag[]>(initialDraftProductTags);

  const crossValueUnificationFactory = () => getCrossValueUnificationFactory(products)
  const getCrossValueUnification = useMemo(crossValueUnificationFactory, [productDependencyString]);

  useEffect(() => {
    setDraftProductTags(initialDraftProductTags);
  }, [initialDraftProductTags]);

  const getRelevantDiscountPercent = () => {
    const priceResult = priceInput.validate(true);
    const discountPriceResult = discountPriceInput.validate(true);
  
    if (!priceResult.isValid || priceInput.value.trim() === '' || !discountPriceResult.isValid || discountPriceInput.value.trim() === '') {
      return null;
    }

    if (!priceResult.data || !discountPriceResult.data) {
      return null;
    }

    return calculateDiscountPercent(priceResult.data, discountPriceResult.data);
  }

  const shouldActLikeMixedValues = (unificationStatus: CrossValueUnification<any>) => (
    (productIds.length > 1 && !unificationStatus.unified) ? true : undefined
  );

  const unificationDeps = [getCrossValueUnification];

  const nameUnification = useMemo(() => getCrossValueUnification((product) => product.name), unificationDeps);
  const nameInput = useTextInputField({
    label: 'Name',
    className: 'name-input-field',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(nameUnification),
    trackMixedValuesState: true,
    value: nameUnification.value,
    anchor: nameUnification.value,
    trackValue: true,
    trackAnchor: true,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => input,
  });

  const priceUnification = useMemo(() => getCrossValueUnification((product) => product.price), unificationDeps);
  const priceInput = useTextInputField<number>({
    label: 'Price',
    className: 'price-input-field',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(priceUnification),
    trackMixedValuesState: true,
    value: priceUnification.value?.toString() ?? '',
    anchor: priceUnification.value?.toString() ?? '',
    trackValue: true,
    trackAnchor: true,
    inputIcon: faDollar,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => {
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

      const priceResult = priceInput.validateCustomValue(data, undefined, true);

      if (products.length <= 1) {
        if (priceResult.isValid) {
          const customDiscountPriceValidator = () => discountPriceValidator(discountPriceInput.value, priceResult);
          discountPriceInput.validateCustomValue(discountPriceInput.value, customDiscountPriceValidator);
        } 
        
        if (data === '') {
          discountPriceInput.statusApplier.restoreDefault();
        }
      }

      if (discountPriceInput.value.trim() === '') {
        return;
      }

      if (priceResult.isValid) {
        const customDiscountPriceValidator = () => discountPriceValidator(discountPriceInput.value, priceResult);
        discountPriceInput.validateCustomValue(discountPriceInput.value, customDiscountPriceValidator);
      } 
      
      if (data === '') {
        discountPriceInput.statusApplier.restoreDefault();
      }
    },
  });

  const discountUnification = useMemo(() => getCrossValueUnification(product => !!product.discountPrice), unificationDeps);
  const discountCheckboxInput = useCheckboxField({
    label: 'Use Discount',
    className: 'name-input',
    value: discountUnification.value,
    anchor: discountUnification.value,
    trackValue: true,
    trackAnchor: true,
    mixedValuesState: shouldActLikeMixedValues(discountUnification),
    trackMixedValuesState: true,
  });

  const discountPriceUnification = useMemo(() => getCrossValueUnification(product =>  product.discountPrice), unificationDeps);
  const discountPriceInput = useTextInputField({
    label: 'Discount Price',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(discountPriceUnification),
    trackMixedValuesState: true,
    value: discountPriceUnification.value?.toString() || undefined,
    anchor: discountPriceUnification.value?.toString() || undefined,
    trackValue: true,
    trackAnchor: true,
    inputIcon: faDollar,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate(input) {
      const priceResult = priceInput.validate(true);

      if (products.length <= 1) {
        return discountPriceValidator(input, priceResult);
      }

      if (priceResult.isValid && priceInput.value.trim() !== '') {
        return discountPriceValidator(input, priceResult);
      } else {
        return discountPriceTypeValidator(input);
      }

    }, 
  });

  const discountExpirationDateUnification = useMemo(() => getCrossValueUnification(
    product => product.discountExpirationDate, (value) => value?.toString() ?? ''
  ), unificationDeps);

  const formattedDiscountExpirationDate = (() => {
    const expirationDate = discountExpirationDateUnification.value
      ? new Date(discountExpirationDateUnification.value)
      : null;

    if (expirationDate) {
      const expirationDatePassed = expirationDate.getTime() - Date.now() <= 0;
      if (expirationDatePassed) {
        return;
      } else {
        const offsetInMs = new Date().getTimezoneOffset() * 60 * 1000;
        const valueFormattedDateWithOffset = new Date(expirationDate.getTime() - offsetInMs).toISOString().replace('Z', '');
        return valueFormattedDateWithOffset;
      }
    }

    return;
  })()

  const discountExpirationDateInput = useTextInputField<Date | undefined>({
    mixedValuesState: shouldActLikeMixedValues(discountExpirationDateUnification),
    trackMixedValuesState: true,
    value: formattedDiscountExpirationDate,
    anchor: formattedDiscountExpirationDate,
    trackValue: true,
    trackAnchor: true,
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

  const descriptionUnification = useMemo(() => getCrossValueUnification(product => product.description), unificationDeps);
  const descriptionInput = useTextareaInput({
    label: 'Description',
    className: 'description-input-field',
    mixedValuesState: shouldActLikeMixedValues(descriptionUnification),
    trackMixedValuesState: true,
    value: descriptionUnification.value,
    anchor: descriptionUnification.value,
    trackValue: true,
    trackAnchor: true,
  });

  const stateUnification = useMemo(() => getCrossValueUnification(product => product.state), unificationDeps);
  const prebuildOption = statusSelections.find(option => option.value === 'prepublic');
  const targetOption = statusSelections.find(option => option.value === stateUnification.value);
  const currentStateOption = targetOption ?? (products?.length === 1 ? prebuildOption : mixedValuesSelectInputFieldOption);

  const stateSelectionInput = useSelectInputField({
    label: 'State',
    className: 'state-input-field',
    mixedValuesState: shouldActLikeMixedValues(stateUnification),
    trackMixedValuesState: true,
    options: statusSelections,
    value: currentStateOption,
    anchor: currentStateOption,
    trackValue: true,
    trackAnchor: true,
    required: true,
  });

  const physicalIdUnification = useMemo(() => getCrossValueUnification(product => product.physicalId), unificationDeps);
  const physicalIdInput = useTextInputField({
    label: 'Physical ID',
    className: 'physical-id-input-field',
    mixedValuesState: shouldActLikeMixedValues(physicalIdUnification),
    trackMixedValuesState: true,
    value: physicalIdUnification.value,
    anchor: physicalIdUnification.value,
    trackValue: true,
    trackAnchor: true,
  })

  const stockUnification = useMemo(() => getCrossValueUnification(product => product.stock), unificationDeps);
  const stockInput = useTextInputField({
    label: 'In Stock',
    className: 'stock-input-field',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(stockUnification),
    trackMixedValuesState: true,
    value: stockUnification.value?.toString(),
    anchor: stockUnification.value?.toString(),
    trackValue: true,
    trackAnchor: true,
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

  const userSearchInputField = useUserSearchInputField({
    datalistUserIdMask: productSeller ? [productSeller.id] : void 0,
    helperText: 'Only one user can be added as the seller.',
    onSubmit(user) {
      setProductSeller(user);
      userSearchInputField.restoreValue();
    }
  });

  const productTagSearchInputField = useProductTagSearchInputField({
    datalistTagIdMask: draftProductTags.map(productTag => productTag.id),
    validate(input) {
      const targetProductTag = fetchedProductTags.find(fetchedProductTag => (
        fetchedProductTag.name === input ||
        fetchedProductTag.id === input
      ));

      if (!targetProductTag) {
        throw new InputFieldError(`Input didn't match with any product tag data (id, name)`);
      }

      if (targetProductTag && draftProductTags.some((draftProductTag) => draftProductTag.id === targetProductTag.id)) {
        throw new InputFieldError('The requested tag is already applied');
      }

      return targetProductTag;
    },
    onSubmit(productTag) {
      const newDraftProductTags = [productTag, ...draftProductTags];
      setDraftProductTags(newDraftProductTags);
      productTagSearchInputField.restoreValue();
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
  const imageEditor = useProductImageShowcaseEditor(products.length === 1 ? products[0] : undefined);

  const restoreProductValues = () => {
    const staticInputsArray = Array.from(Object.values(staticInputs));
    staticInputsArray.forEach((input) => input.restoreValue());
    staticInputsArray.forEach(input => input.statusApplier.restoreDefault());
    
    setDraftProductTags(getInitialDraftProductTags());
    inputFieldCollection.restore();
  }

  const validateInputs = (): Product[] => {
    const validatedCluster = validateComponentStateInputs(staticInputs);
    const discountCheckboxValidationResult = validatedCluster.validationResults.discountCheckboxInput;
    const shouldValidateDiscountInputs = discountCheckboxValidationResult.data || discountCheckboxValidationResult.isForMixedValues;

    const discountPriceResult = shouldValidateDiscountInputs
      ? discountPriceInput.validate() 
      : void 0;

    const discountExpirationDateResult = shouldValidateDiscountInputs
      ? discountExpirationDateInput.validate()
      : void 0;

    const specificationResult = inputFieldCollection.validate();
    
    if (
      !validatedCluster.isValid || 
      (discountPriceResult && !discountPriceResult.isValid) ||
      (discountExpirationDateResult && !discountExpirationDateResult.isValid) ||
      (productIds.length <= 1 && !specificationResult.collectionIsValid)
    ) {
      console.log('err')
      return [];
    }

    const mutateUnmixedProductFields = (product: Writeable<Product>) => {
      if (!validatedCluster.validationResults.nameInput.isForMixedValues) {
        product.name = validatedCluster.validationResults.nameInput.data;
      }

      if (!validatedCluster.validationResults.priceInput.isForMixedValues) {
        product.price = validatedCluster.validationResults.priceInput.data;
      }

      if (validatedCluster.validationResults.discountCheckboxInput.isForMixedValues) {
        // apply selectivly
        if (discountPriceResult && !discountPriceResult.isForMixedValues) {
          product.discountPrice = discountPriceResult.data;
        }

        if (discountExpirationDateResult && !discountExpirationDateResult.isForMixedValues) {
          product.discountExpirationDate = discountExpirationDateResult.data?.toString() ?? null;
        }
      } else if (validatedCluster.validationResults.discountCheckboxInput.data) {
        // apply for all
        if (discountPriceResult && !discountPriceResult.isForMixedValues) {
          product.discountPrice = discountPriceResult.data;
        }

        if (discountExpirationDateResult && !discountExpirationDateResult.isForMixedValues) {
          product.discountExpirationDate = discountExpirationDateResult.data?.toString() ?? null;
        }
      } else {
        // delete all
        product.discountPrice = null;
        product.discountExpirationDate = null;
      }

      if (!validatedCluster.validationResults.descriptionInput.isForMixedValues) {
        product.description = validatedCluster.validationResults.descriptionInput.data;
      }

      if (!validatedCluster.validationResults.physicalIdInput.isForMixedValues) {
        product.physicalId = validatedCluster.validationResults.physicalIdInput.data;
      }

      if (!validatedCluster.validationResults.stateSelectionInput.isForMixedValues) {
        product.state = validatedCluster.validationResults.stateSelectionInput.data.value as any;
      }

      if (!validatedCluster.validationResults.stockInput.isForMixedValues) {
        product.stock = validatedCluster.validationResults.stockInput.data;
      }

      product.seller = productSeller || null;

      return product;
    }

    type SuccessfulInputFieldResponse = InputFieldCollection.Field.Stable.ValidationResult.Success<Product.Tag.Field>;

    const formatSpecification = (typedSpecifications: SuccessfulInputFieldResponse[]) => (
      typedSpecifications.map((result) => ({
        field: result.field.payload,
        value: result.data as string,
      }))
    )

    switch (products.length) {
      case 0: {
        const product: Writeable<Product> = {
          name: validatedCluster.validationResults.nameInput.data,
          description: validatedCluster.validationResults.descriptionInput.data,
          price: validatedCluster.validationResults.priceInput.data,
          discountPrice: discountPriceResult?.data ?? null,
          discountExpirationDate: discountExpirationDateResult?.data?.toString() ?? null,
          physicalId: validatedCluster.validationResults.descriptionInput.data,
          state: validatedCluster.validationResults.stateSelectionInput.data.value as any,
          stock: validatedCluster.validationResults.stockInput.data,
          creationDate: new Date().toString(),
          seller: productSeller || null,
          tags: [],
          specifications: [],
          id: '',
          urn: {
            thumbnail: null,
            thumbs: [],
          },
        }

        product.specifications = formatSpecification(specificationResult.successes as SuccessfulInputFieldResponse[]);
        product.tags = draftProductTags;
        return [product];
      }

      case 1:
        const updatedProduct: Writeable<Product> = {
          ...mutateUnmixedProductFields({...products[0]})
        };

        updatedProduct.tags = draftProductTags;
        updatedProduct.specifications = formatSpecification(specificationResult.successes as SuccessfulInputFieldResponse[]);;
        return [updatedProduct];

      default:
        const updatedProducts: Product[] = [];
        for (const product of products) {
          const updatedProduct: Writeable<Product> = {
            ...product,
          }

          const newProduct = {...mutateUnmixedProductFields(updatedProduct)};
          updatedProducts.push(newProduct);
        }
        return updatedProducts;
    }
  }

  const inputFieldCollectionDependencies = [productDependencyString, draftProductTags];
  const inputFieldCollectionDescriptors = useMemo(() => getInputFieldCollectionDescriptors(), inputFieldCollectionDependencies)
  const inputFieldCollection = useInputFieldCollection({
    descriptorUpdateDependencies: inputFieldCollectionDependencies,
    fieldDescriptors: inputFieldCollectionDescriptors,
  });

  const productSellerAvatar = useGravatarAvatar({
    skip: !productSeller,
    email: productSeller?.email,
  });

  const discountPercent = getRelevantDiscountPercent();

  const render = () => (
    <div className='product-inspector-area'>
      <article className="product-image-showcase-editor">
        {imageEditor.render()}
      </article>
      <SequentialSectionContainer>
        <SequentialSection title="General Information" className='general-information-section'>
          { nameInput.render() }
          { descriptionInput.render() }
          { priceInput.render() }
          <div className='discount-information-container'>
            <header>
              { discountCheckboxInput.render() }
              { discountCheckboxInput.value && discountPercent !== null && (
                <span className=''>-{discountPercent}%</span> 
              )}
            </header>
            { (discountCheckboxInput.value || discountCheckboxInput.mixedValuesState) && (
              <div className='discount-input-fields'>
                {discountPriceInput.render()}
                {discountExpirationDateInput.render()}
              </div>
            ) }
          </div>
          { stateSelectionInput.render() }
          { physicalIdInput.render() }
          { stockInput.render() }
        </SequentialSection>
        <SequentialSection title='Item Seller' className="product-seller-section">
          {userSearchInputField.render()}
          <div className="seller-container" data-seller-exist={!!productSeller}>
            <div className="seller-info-container">
              {productSeller && <AvatarDisplayer src={productSellerAvatar.data} className="avatar" />}
              <h3>{productSeller ? `${productSeller.fullname.last} ${productSeller.fullname.first}` : 'No seller applied'}</h3>
              <span>{productSeller ? productSeller.email : 'Search for user to change'}</span>
            </div>
            <div className='product-tag-management' key={productSeller?.id}>
              {productSeller && (
                <button title='Inspect User' onClick={() => navigate(`/users/${productSeller?.id}/inspect`)} key='inspect'>
                  <FontAwesomeIcon icon={faEdit} size={"lg"} />
                </button>
              )}
              {(!!productSeller !== !!productSellerAnchor || productSeller?.id !== productSellerAnchor?.id) && productSellerAnchor && (
                <button title='Restore seller' onClick={() => setProductSeller(productSellerAnchor)} key='restore'>
                  <FontAwesomeIcon icon={faRotateLeft} size={'lg'} />
                </button>
              )}
              {productSeller && (
                <button title='Remove seller' onClick={() => setProductSeller(undefined)} key='remove'>
                  <FontAwesomeIcon icon={faTrash} size={"lg"} />
                </button>
              )}
            </div>
          </div>
          <ul className="p">
            <li>When a user is added as the seller, their account will display that they are the seller of the respective product. This is visible to the user and admins when inspecting the user's account.</li>
            <li>The user's account will show all the items they are currently selling, including those in review or available to the public.</li>
          </ul>
        </SequentialSection>
        { productIds.length <= 1 && (
          <SequentialSection title='Tag Specifications' className="tag-specifications-section">
            { productTagSearchInputField.render() }
            <div className="product-tag-list">
              { draftProductTags.map(draftProductTag => (
                <SubProductTagInspector
                  productTag={draftProductTag}
                  removeProductTag={() => removeDraftProductTag(draftProductTag.id)}
                  specificationGroup={inputFieldCollection.createFieldGroup(draftProductTag.id)}
                />
              )) }
            </div>
            <span>[Unique specifications]</span>
          </SequentialSection>
        )}
        <SequentialSection title="Snapshots">
        </SequentialSection>
      </SequentialSectionContainer>
    </div>
  );

  return {
    render,
    restoreProductValues,
    validateInputs,
    imageEditor,
  }

  function removeDraftProductTag(id: string) {
    setDraftProductTags((productTags) => {
      const newProductTags = productTags.filter(productTag => productTag.id !== id);
      return newProductTags;
    });
  }

  function getFieldSpecificationDescriptor(field: Product.Tag.Field): CrossValueUnification<string> {
    if (products.length === 1) {
      return {
        unified: true,
        value: products[0].specifications.find(spec => spec.field.id === field.id)?.value ?? '',
      }
    }

    const specifications = products.map(p => p.specifications).flat();
    const fieldSpecs = specifications.filter(specification => specification.field.id === field.id);
    const getCrossValueUnification = getCrossValueUnificationFactory(fieldSpecs);
    const unificationResult = getCrossValueUnification(specification => specification.value);
    return unificationResult;
  }

  function getInputFieldCollectionDescriptors() {
    return draftProductTags.map<InputFieldCollection.Field.Descriptor<Product.Tag.Field>[]>(
      (tag) => tag.fields.map((field) => getDescriptor(tag, field))
    ).flat();

    function getDescriptor(tag: Product.Tag, field: Product.Tag.Field) {
      const unificationStatusResult = getFieldSpecificationDescriptor(field);
      const inputFieldDescriptor: InputFieldCollection.Field.Descriptor<Product.Tag.Field> = {
        fieldType: InputFieldCollection.FieldType.Text,
        mixedValuesState: shouldActLikeMixedValues(unificationStatusResult),
        identifier: field.id,
        label: field.name,
        placeholder: `ex. ${field.example}`,
        value: unificationStatusResult.value ?? '',
        anchor: unificationStatusResult.value ?? '',
        group: [tag.id, field.id],
        required: field.required,
        payload: field,
        validationTimings: [InputField.ValidationTiming.Blur],
        validate(_, data) {
          return data;
        }
      }

      return inputFieldDescriptor;
    }
  }
}

export default useProductInspector;

function discountPriceTypeValidator(discountInput: string) {
  const discount = Number(discountInput);
  if (Number.isNaN(discount)) {
    throw new InputFieldError('Input is not a number');
  }

  if (discount < 0) {
    throw new InputFieldError(`Price can't be negative`);
  }

  return discount;
}

function discountPriceRelativityValidator(discount: number, priceResult: InputField.State.ValidationResult<any>) {
  if (!priceResult.isValid) {
    return discount;
  }

  if (discount > priceResult.data) {
    throw new InputFieldError(`Discount can't be higher than the price`);
  }

  if (discount === priceResult.data) {
    throw new InputFieldError(`Discount can't be equal to the price`);
  }
}

function discountPriceValidator(discountInput: string, priceResult: InputField.State.ValidationResult<any>) {
  const discount = discountPriceTypeValidator(discountInput);
  discountPriceRelativityValidator(discount, priceResult);
  return discount;
}
