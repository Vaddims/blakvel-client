import * as uuid from 'uuid';
import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { Product } from '../../../models/product.model';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { ProductTagFieldInspector } from './ProductTagFieldInspector';
import { useGetProductTagQuery } from '../../../services/api/productsApi';
import useTextInputField from '../../hooks/text-input-field-hook';
import { InputField } from '../../hooks/input-field-hook';
import useInputFieldCollection, { InputFieldCollection } from '../../hooks/use-input-field-collection-hook';
import { v4 as createUUID } from 'uuid';
import './product-tag-inspector.scss';

export interface ProductTagInspectorOptions {
  readonly tagId?: string;
}

export interface ProductTagFieldDescriptor extends Product.Mixed.Tag.Field {
  readonly localUid: string;
}

export const useProductTagInspector = (options: ProductTagInspectorOptions = {}) => {
  const { id = '' } = useParams();
  const { data: productTag } = useGetProductTagQuery(id, { skip: !id })
  const [ draftFieldDescriptors, setDraftFieldDescriptors ] = useState<ProductTagFieldDescriptor[]>([]);

  const productTagNameInputField = useTextInputField({
    label: 'Tag name',
    required: true,
    inputIcon: faHashtag,
    value: productTag?.name,
    anchor: productTag?.name,
    trackAnchor: true,
    trackValue: true,
    validationTimings: [InputField.ValidationTiming.Blur]
  });

  const createProductTagFieldDescriptor = (providedProductTag: Product.Mixed.Tag.Field, override?: Partial<Product.Mixed.Tag.Field>) => {
    const descriptor: ProductTagFieldDescriptor = {
      localUid: createUUID(),
      ...providedProductTag,
      ...override,
    }

    return descriptor;
  }

  const createField = () => {
    setDraftFieldDescriptors((state) => {
      const newField = createProductTagFieldDescriptor({
        name: '',
        example: '',
        required: false,
      });

      const newState = [newField, ...state];
      return newState;
    })
  };

  const updateField = (localId: string, inputs?: Partial<Product.Tag.Field>, tagField?: Product.Tag.Field) => {
    setDraftFieldDescriptors((state) => {
      const fieldIndex = state.findIndex(descriptor => descriptor.localUid === localId);
      if (fieldIndex === -1) {
        console.warn(`Could not update ProductTagField(${localId})`);
        return state;
      }

      const newState = [...state];
      newState[fieldIndex] = {
        ...state[fieldIndex],
        ...tagField,
      }

      const { fields } = inputFieldCollection.createFieldGroup(localId);
      (fields[0] as InputFieldCollection.Field.Stable.TextInpuField).modify((field) => ({
        value: inputs?.name ?? field.value,
        anchor: newState[fieldIndex].name
      }));

      (fields[1] as InputFieldCollection.Field.Stable.TextInpuField).modify((field) => ({
        value: inputs?.example ?? field.value,
        anchor: newState[fieldIndex].example,
      }));

      (fields[2] as InputFieldCollection.Field.Stable.CheckboxInputField).modify((field) => ({
        value: inputs?.required ?? field.value,
      }));

      return newState;
    })
  }

  const removeField = (localId: string) => {
    setDraftFieldDescriptors((state) => {
      const fieldIndex = state.findIndex(descriptor => descriptor.localUid === localId);
      if (fieldIndex === -1) {
        console.warn(`Could not update ProductTagField(${localId})`);
        return state;
      }

      const newState = state.filter(field => field.localUid !== localId);
      return newState;
    })
  }

  const exchangeFieldPositions = (fieldId1: string, fieldId2: string) => {
    setDraftFieldDescriptors((draftFieldDescriptors) => {
      const findFieldIndex = (fieldLocalId: string) => draftFieldDescriptors.findIndex(descriptor => descriptor.localUid === fieldLocalId);

      const fieldIndex1 = findFieldIndex(fieldId1);
      const fieldIndex2 = findFieldIndex(fieldId2);

      if (fieldIndex1 === -1 || fieldIndex2 === -1) {
        console.warn(`Could not perform field swap for ProductTagField(${fieldId1}) and ProductTagField(${fieldId2})`);
        return draftFieldDescriptors;
      }

      const newDraftFieldDescriptors = [...draftFieldDescriptors];
      [draftFieldDescriptors[fieldIndex1], draftFieldDescriptors[fieldIndex2]] = [draftFieldDescriptors[fieldIndex2], draftFieldDescriptors[fieldIndex1]];
      return newDraftFieldDescriptors;
    })
  }

  const getExistingTwinField = (providedField: ProductTagFieldDescriptor, inputFieldName: string ) => {
    if (providedField.id) { // the field is already linked
      return;
    }

    const sameNameExistingField = productTag?.fields?.find(existingField => existingField.name === inputFieldName);
    if (!sameNameExistingField) {
      return;
    }

    if (draftFieldDescriptors.some(descriptor => descriptor.id === sameNameExistingField.id)) {
      return;
    }

    return sameNameExistingField;
  }

  const createInputFieldDescriptorsFromTagFieldDescriptor = (fieldDescriptor: ProductTagFieldDescriptor) => {
    const inputFieldDescriptors: InputFieldCollection.Field.Descriptor[] = [
      {
        fieldType: InputFieldCollection.FieldType.Text,
        identifier: `NameField${fieldDescriptor.localUid}`,
        required: true,
        label: 'Display Name',
        value: fieldDescriptor.name,
        anchor: fieldDescriptor.name,
        group: [fieldDescriptor.localUid],
        validationTimings: [InputField.ValidationTiming.Blur],
        validate: (_, data) => data,
      },
      {
        fieldType: InputFieldCollection.FieldType.Text,
        identifier: `FormatExample${fieldDescriptor.localUid}`,
        label: 'Format Example',
        helperText: `The format example will be shown only in product inspection mode.`,
        value: fieldDescriptor.example,
        anchor: fieldDescriptor.example,
        group: [fieldDescriptor.localUid],
        validationTimings: [InputField.ValidationTiming.Blur],
        validate: (_, data) => data,
      },
      {
        fieldType: InputFieldCollection.FieldType.Checkbox,
        identifier: `Required${fieldDescriptor.localUid}`,
        label: 'Require field to be filled in',
        value: fieldDescriptor.required,
        anchor: fieldDescriptor.required,
        group: [fieldDescriptor.localUid],
        validationTimings: [InputField.ValidationTiming.Blur],
        validate: (_, data) => data,
      }
    ];

    return inputFieldDescriptors;
  }

  useEffect(() => {
    if (productTag) {
      setDraftFieldDescriptors(productTag.fields.map((field) => createProductTagFieldDescriptor(field)))
    }
  }, [productTag]);

  const inputFieldCollection = useInputFieldCollection({
    fieldDescriptors: draftFieldDescriptors.map(createInputFieldDescriptorsFromTagFieldDescriptor).flat(),
    descriptorUpdateDependencies: [draftFieldDescriptors],
  });

  const render = () => (
    <Fragment>
      { productTagNameInputField.render() }
      <div className="product-tag-dynamic-fields">
        {draftFieldDescriptors.map(descriptor => (
          <ProductTagFieldInspector
            key={descriptor.localUid}
            inputFieldCollection={inputFieldCollection}
            fieldDescriptor={descriptor}
            exchangeFieldPositions={exchangeFieldPositions}
            update={(inputs?: Partial<Product.Mixed.Tag.Field>, tagField?: Product.Tag.Field) => updateField(descriptor.localUid, inputs, tagField)}
            remove={() => removeField(descriptor.localUid)}
            linkField={getExistingTwinField(descriptor, inputFieldCollection.createFieldGroup(descriptor.localUid).fields[0]?.value as string ?? '')}
          />
        ))}
      </div>
    </Fragment>
  )

  return {
    render,
    validateInputs: () => inputFieldCollection.validate(),
    createField,
    updateField,
    removeField,
    exchangeFieldPositions,
  }
}
