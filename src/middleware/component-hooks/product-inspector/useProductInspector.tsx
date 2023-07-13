import { faBoxes, faCalendarMinus, faDollar, faEdit, faHashtag, faRotateLeft, faSearch, faTrash, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { useProductImageShowcaseEditor } from "../../../components/ProductImageEditor/useProductImageShowcaseEditor";
import { Product } from "../../../models/product.model";
import { useGetProductTagsQuery, useGetProductsQuery } from "../../../services/api/productsApi";
import useCheckboxField from "../../hooks/checkbox-field-hook";
import useSelectInputField, { mixedValuesSelectInputFieldOption } from "../../hooks/select-input-field-hook";
import statusSelections from './status.selection.json';
import useTextareaInput from "../../hooks/textarea-input-field-hook";
import { InputField, InputFieldError, validateComponentStateInputs } from "../../hooks/input-field-hook";
import useTextInputField from "../../hooks/text-input-field-hook";
import useInputFieldCollection, { InputFieldCollection } from "../../hooks/use-input-field-collection-hook";
import SubProductTagInspector from "./SubProductTagInspector";
import useSearchParamState from "../../hooks/useSearchParamState";
import './product-inspector.scss';
import useGravatarAvatar from "../../hooks/gravatar-avatar-hook";
import { User } from "../../../models/user.model";
import AvatarDisplayer from "../../../components/AvatarDisplayer";
import { useGetUsersQuery } from "../../../services/api/usersApi";
import { useNavigate } from "react-router-dom";
import { InputFieldDatalistElement } from "../../../components/TextInputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProductInspectorOptions {
  readonly productIds?: string[];
  readonly disableSkeletonLayout?: boolean;
}

const discountPriceTypeValidator = (discountInput: string) => {
  const discount = Number(discountInput);
  if (Number.isNaN(discount)) {
    throw new InputFieldError('Input is not a number');
  }

  if (discount < 0) {
    throw new InputFieldError(`Price can't be negative`);
  }

  return discount;
}

const discountPriceRelativityValidator = (discount: number, priceResult: InputField.State.ValidationResult<any>) => {
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

const discountPriceValidator = (discountInput: string, priceResult: InputField.State.ValidationResult<any>) => {
  const discount = discountPriceTypeValidator(discountInput);
  discountPriceRelativityValidator(discount, priceResult);
  return discount;
}

export const useProductInspector = (options?: ProductInspectorOptions) => {
  const {
    paramCluster,
    urlSearchParams,
  } = useSearchParamState();
  const navigate = useNavigate();

  const { data: fetchedUsers = [] } = useGetUsersQuery();

  // TODO Implement server data
  const [ productSellerAnchor, setProductSellerAnchor ] = useState<User>();
  const [ productSeller, setProductSeller ] = useState<User>();
  useEffect(() => {
  }, [fetchedUsers]);

  const productIds = paramCluster.inspect.all;

  const s = new URLSearchParams([['format', 'admin']]);
  for (const a of productIds) {
    s.append('target', a);
  }

  const { data: products = [] } = useGetProductsQuery(s.toString(), { skip: productIds.length === 0 });

  const { data: globalProductTags = [] } = useGetProductTagsQuery();

  const draftProductsInit = () => {
    if (products.length !== 0) {
      const tags = products.map(p => p.tags).flat();
      const uniqueTagIds = new Set(tags.map(tag => tag.id));
      const uniqueTags = globalProductTags.filter(tag => uniqueTagIds.has(tag.id));
      return uniqueTags;
    }

    return [];
  }

  const [ draftProductTags, setDraftProductTags ] = useState<Product.Tag[]>(draftProductsInit());
  const a = () => draftProductTags.map(pt => pt.id).join('&');

  useEffect(() => {
    setDraftProductTags(draftProductsInit());
  }, [products.map(p => p.id).join('&')]);

  const removeDraftProductTag = (id: string) => {
    setDraftProductTags((productTags) => {
      const newProductTags = productTags.filter(productTag => productTag.id !== id);
      return newProductTags;
    });
  }

  interface MultiValueUnificationStatus<T> {
    readonly unified: boolean;
    readonly value: T | undefined;
  }

  const getMultiValueUnificationStatusFactory = function<T>(elements?: T[]) {
    return function<K>(pipe: (value: T) => K, identifier?: (v: K) => string | number | boolean): MultiValueUnificationStatus<K> {
      const pipedElements = elements?.map(pipe);
      
      const getPrimitiveValueFrom = (value: K) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
          return value;
        }
  
        if (!identifier) {
          throw new Error('Identificator is required');
        }
  
        return identifier(value);
      }
  
      if (!pipedElements) {
        return {
          unified: true,
          value: undefined,
        }
      }
  
      for (const element of pipedElements) {
        if (getPrimitiveValueFrom(element) !== getPrimitiveValueFrom(pipedElements[0])) {
          return {
            unified: false,
            value: undefined,
          };
        }
      }
  
      return {
        unified: true,
        value: pipedElements[0],
      };
    }
  }

  const calculateDiscountPercent = () => {
    return 0;
    // const priceResult = priceInput.validate(true);
    // const discountPriceResult = discountPriceInput.validate(true);
  
    // if (!priceResult.isValid || priceInput.value.trim() === '' || !discountPriceResult.isValid || discountPriceInput.value.trim() === '') {
    //   return null;
    // }
  
    // const price = priceResult.data;
    // const discountPrice = discountPriceResult.data;
  
    // if (price < discountPrice) {
    //   return null;
    // }
  
    // const discountPercent = 100 - Math.round(discountPrice / price * 100);
    // return discountPercent;
  }

  const shouldActLikeMixedValues = (unificationStatus: MultiValueUnificationStatus<any>) => (
    (productIds.length > 1 && !unificationStatus.unified) ? true : undefined
  );

  const getMultiValueUnificationStatus = getMultiValueUnificationStatusFactory(products);

  const nameUnificationStatus = getMultiValueUnificationStatus((product) => product.name);
  const nameInput = useTextInputField({
    label: 'Name',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(nameUnificationStatus),
    trackMixedValuesState: true,
    value: nameUnificationStatus.value,
    anchor: nameUnificationStatus.value,
    trackValue: true,
    trackAnchor: true,
    validationTimings: [InputField.ValidationTiming.Blur],
    validate: (input) => input,
  });

  const priceUnificationStatus = getMultiValueUnificationStatus((product) => product.price);
  const priceInput = useTextInputField<number>({
    label: 'Price',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(priceUnificationStatus),
    trackMixedValuesState: true,
    value: priceUnificationStatus.value?.toString() ?? '',
    anchor: priceUnificationStatus.value?.toString() ?? '',
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

  const discountResult = getMultiValueUnificationStatus<boolean>(product => !!product.discountPrice);
  const discountCheckboxInput = useCheckboxField({
    label: 'Use Discount',
    value: discountResult.value,
    anchor: discountResult.value,
    trackValue: true,
    trackAnchor: true,
    mixedValuesState: shouldActLikeMixedValues(discountResult),
    trackMixedValuesState: true,
  });

  const discountPriceUnificationStatus = getMultiValueUnificationStatus(product => product.discountPrice);
  const discountPriceInput = useTextInputField({
    label: 'Discount Price',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(discountPriceUnificationStatus),
    trackMixedValuesState: true,
    value: discountPriceUnificationStatus.value?.toString() || undefined,
    anchor: discountPriceUnificationStatus.value?.toString() || undefined,
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

  const discountExpirationDateResult = getMultiValueUnificationStatus(
    product => product.discountExpirationDate, (value) => value?.toString() ?? ''
  );

  const formattedDiscountExpirationDate = (() => {
    const expirationDate = discountExpirationDateResult.value
      ? new Date(discountExpirationDateResult.value)
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
    mixedValuesState: shouldActLikeMixedValues(discountExpirationDateResult),
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

  const descriptionUnificationStatus = getMultiValueUnificationStatus(product => product.description);
  const descriptionInput = useTextareaInput({
    label: 'Description',
    mixedValuesState: shouldActLikeMixedValues(descriptionUnificationStatus),
    trackMixedValuesState: true,
    value: descriptionUnificationStatus.value,
    anchor: descriptionUnificationStatus.value,
    trackValue: true,
    trackAnchor: true,
  });

  
  const stateUnificationStatus = getMultiValueUnificationStatus(product => product.state);

  const prebuildOption = statusSelections.find(option => option.value === 'prepublic');
  const targetOption = statusSelections.find(option => option.value === stateUnificationStatus.value);
  const currentStateOption = targetOption ?? (products?.length === 1 ? prebuildOption : mixedValuesSelectInputFieldOption);

  const stateSelectionInput = useSelectInputField({
    label: 'State',
    mixedValuesState: shouldActLikeMixedValues(stateUnificationStatus),
    trackMixedValuesState: true,
    options: statusSelections,
    value: currentStateOption,
    anchor: currentStateOption,
    trackValue: true,
    trackAnchor: true,
    required: true,
  });

  const physicalIdUnificationStatus = getMultiValueUnificationStatus(product => product.physicalId);
  const physicalIdInput = useTextInputField({
    label: 'Physical ID',
    mixedValuesState: shouldActLikeMixedValues(physicalIdUnificationStatus),
    trackMixedValuesState: true,
    value: physicalIdUnificationStatus.value,
    anchor: physicalIdUnificationStatus.value,
    trackValue: true,
    trackAnchor: true,
  })

  const stockUnificationStatus = getMultiValueUnificationStatus(product => product.stock);
  const stockInput = useTextInputField({
    label: 'In Stock',
    required: true,
    mixedValuesState: shouldActLikeMixedValues(stockUnificationStatus),
    trackMixedValuesState: true,
    value: stockUnificationStatus.value?.toString(),
    anchor: stockUnificationStatus.value?.toString(),
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
    placeholder: 'Search Tag',
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

  const userDatalistElements: InputFieldDatalistElement[] = fetchedUsers.map(u => ({
    name: u.email,
    description: 'Vadym Iefremov',
  }));

  const searchUser = useTextInputField({
    inputIcon: faSearch,
    className: 'seller-search',
    placeholder: 'Search User',
    required: true,
    datalist: userDatalistElements,
    helperText: 'Only one user can be added as the seller.',
    validationTimings: [InputField.ValidationTiming.Submit],
    validate(input) {
      const user = fetchedUsers.find(user => (
        user.email === input ||
        user.id === input
      ));

      if (!user) {
        throw new InputFieldError(`Input didn't match with any user data (id, email)`);
      }

      setProductSeller(user);

      searchUser.clearValue();
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

  // // TODO REWORK
  const imageEditor = useProductImageShowcaseEditor(products.length === 1 ? products[0] : undefined);

  // // TODO Trasnfer somewhere else
  // const calculateDiscountPercent = () => {
  //   const priceResult = priceInput.validate(true);
  //   const discountPriceResult = discountPriceInput.validate(true);

  //   if (!priceResult.isValid || !discountPriceResult.isValid) {
  //     return null;
  //   }

  //   const price = priceResult.data;
  //   const discountPrice = discountPriceResult.data;

  //   if (price < discountPrice) {
  //     return null;
  //   }

  //   const discountPercent = 100 - Math.round(discountPrice / price * 100);
  //   return discountPercent;
  // }

  const restoreProductValues = () => {
    const staticInputsArray = Array.from(Object.values(staticInputs));
    staticInputsArray.forEach((input) => input.restoreValue());
    staticInputsArray.forEach(input => input.statusApplier.restoreDefault());
    
    setDraftProductTags(draftProductsInit());
    inputFieldCollection.restore();
  }

  type Writeable<T extends { [x: string]: any }> = {
    -readonly [P in keyof T]: T[P];
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

    const p = (prod: Writeable<Product>) => {
      if (!validatedCluster.validationResults.nameInput.isForMixedValues) {
        prod.name = validatedCluster.validationResults.nameInput.data;
      }

      if (!validatedCluster.validationResults.priceInput.isForMixedValues) {
        prod.price = validatedCluster.validationResults.priceInput.data;
      }

      if (validatedCluster.validationResults.discountCheckboxInput.isForMixedValues) {
        // apply selectivly
        if (discountPriceResult && !discountPriceResult.isForMixedValues) {
          prod.discountPrice = discountPriceResult.data;
        }

        if (discountExpirationDateResult && !discountExpirationDateResult.isForMixedValues) {
          prod.discountExpirationDate = discountExpirationDateResult.data?.toString() ?? null;
        }
      } else if (validatedCluster.validationResults.discountCheckboxInput.data) {
        // apply for all
        if (discountPriceResult && !discountPriceResult.isForMixedValues) {
          prod.discountPrice = discountPriceResult.data;
        }

        if (discountExpirationDateResult && !discountExpirationDateResult.isForMixedValues) {
          prod.discountExpirationDate = discountExpirationDateResult.data?.toString() ?? null;
        }
      } else {
        // delete all
        prod.discountPrice = null;
        prod.discountExpirationDate = null;
      }

      if (!validatedCluster.validationResults.descriptionInput.isForMixedValues) {
        prod.description = validatedCluster.validationResults.descriptionInput.data;
      }

      if (!validatedCluster.validationResults.physicalIdInput.isForMixedValues) {
        prod.physicalId = validatedCluster.validationResults.physicalIdInput.data;
      }

      if (!validatedCluster.validationResults.stateSelectionInput.isForMixedValues) {
        prod.state = validatedCluster.validationResults.stateSelectionInput.data.value as any;
      }

      if (!validatedCluster.validationResults.stockInput.isForMixedValues) {
        prod.stock = validatedCluster.validationResults.stockInput.data;
      }

      return prod;
    }

    switch (products.length) {
      case 0: {
        const s: Writeable<Product> = {
          name: validatedCluster.validationResults.nameInput.data,
          description: validatedCluster.validationResults.descriptionInput.data,
          price: validatedCluster.validationResults.priceInput.data,
          discountPrice: discountPriceResult?.data ?? null,
          discountExpirationDate: discountExpirationDateResult?.data?.toString() ?? null,
          physicalId: validatedCluster.validationResults.descriptionInput.data,
          state: validatedCluster.validationResults.stateSelectionInput.data.value as any,
          stock: validatedCluster.validationResults.stockInput.data,
          creationDate: new Date().toString(),
          tags: [],
          specifications: [],
          id: '',
          urn: {
            thumbnail: null,
            thumbs: [],
          }
        }

        const typedSpecs = specificationResult.successes as InputFieldCollection.Field.Stable.ValidationResult.Success<Product.Tag.Field>[];
        
        const specs: Product.Specification[] = typedSpecs.map(result => ({
          field: result.field.payload,
          value: result.data as string,
        }))

        s.tags = draftProductTags;
        s.specifications = specs;
        return [s];
      }

      case 1:
        const updatedProduct: Writeable<Product> = {
          ...p({...products[0]})
        };

        const typedSpecs = specificationResult.successes as InputFieldCollection.Field.Stable.ValidationResult.Success<Product.Tag.Field>[];
        
        const specs: Product.Specification[] = typedSpecs.map(result => ({
          field: result.field.payload,
          value: result.data as string,
        }))

        updatedProduct.tags = draftProductTags;
        updatedProduct.specifications = specs;
        return [updatedProduct];

      default:
        const updatedProducts: Product[] = [];
        for (const product of products) {
          const updatedProduct: Writeable<Product> = {
            ...product,
          }

          const a = {...p(updatedProduct)};
          updatedProducts.push(a);
          
          console.log('>>', a);
        }
        return updatedProducts;
    }
  }

  const getFieldDescritproSpec = (field: Product.Tag.Field): MultiValueUnificationStatus<string> => {
    if (products.length === 1) {
      return {
        unified: true,
        value: products[0].specifications.find(spec => spec.field.id === field.id)?.value ?? '',
      }
    }

    const specs = products.map(p => p.specifications).flat();
    const fieldSpecs = specs.filter(spec => spec.field.id === field.id);
    const a = getMultiValueUnificationStatusFactory(fieldSpecs);
    const unificationResult = a(e => e.value);
    return unificationResult;
  }

  const temp = () => {
    const handle = (tag: Product.Tag, field: Product.Tag.Field) => {
      const unificationStatusResult = getFieldDescritproSpec(field);
      const a: InputFieldCollection.Field.Descriptor<Product.Tag.Field> = {
        fieldType: InputFieldCollection.FieldType.Text,
        mixedValuesState: shouldActLikeMixedValues(unificationStatusResult),
        identifier: field.id,
        label: field.name,
        placeholder: `ex. ${field.example}`,
        value: unificationStatusResult.value ?? '', // '', // product?.specifications.find(spec => spec.field.id === field.id)?.value ?? '',
        anchor: unificationStatusResult.value ?? '', // '', // product?.specifications.find(spec => spec.field.id === field.id)?.value ?? '',
        group: [tag.id, field.id],
        required: field.required,
        payload: field,
        validationTimings: [InputField.ValidationTiming.Blur],
        validate(_, data) {
          return data;
        }
      }

      return a;
    }

    return draftProductTags.map<InputFieldCollection.Field.Descriptor<Product.Tag.Field>[]>((tag) => tag.fields.map((field) => handle(tag, field))).flat();
  }

  const inputFieldCollection = useInputFieldCollection({
    descriptorUpdateDependencies: [products.map(p => p.id).join('&'), draftProductTags],
    fieldDescriptors: temp(),
  });
  // for future

  const productSellerAvatar = useGravatarAvatar({
    skip: !productSeller,
    email: productSeller?.email,
  });

  console.log(productSellerAvatar, productSeller)

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
                { (discountCheckboxInput.value || discountCheckboxInput.mixedValuesState) && (
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
            Seller
            <hr className="divider" />
          </header>
          <div className="cluster">
            <article className="seller-information">
              {searchUser.render()}
              <div className="seller-container" data-seller-exist={!!productSeller}>
                <div className="seller-info-container">
                  {productSeller && <AvatarDisplayer src={productSellerAvatar.data} className="avatar" />}
                  <h3>{productSeller ? productSeller.email.split('@')[0] : 'No seller applied'}</h3>
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
            </article>
          </div>
        </section>
        { productIds.length <= 1 && (
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
        )}
        {false && (
          <section className="info-row">
            <header className="row-divider">
              Timelined Snapshots
              <hr className="divider" />
            </header>
            <div className="cluster">
              
            </div>
          </section>
        )}
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

export default useProductInspector;