import * as uuid from 'uuid';
import { useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { InputField, InputStatus } from '../../../components/InputField';
import { ProductTagFieldBundle, ProductTagFieldInspection } from '../../../pages/InspectProductTag/ProductTagFieldInspection';
import { Product } from '../../../models/product.model';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { composedValueAbordSymbol, useInputFieldManagement } from '../../hooks/useInputFieldManagement';
import { ProductTagFieldInspector } from './ProductTagFieldInspector';
import './product-tag-inspector.scss';
import { useGetProductTagQuery, useGetProductTagsQuery } from '../../../services/api/productsApi';
import { useInputFieldCollectionManagement } from '../../hooks/useInputFieldCollectionManagement';
import { FieldDescriptor } from '../../hooks/useInputFieldCollectionManagement';

export interface ProductTagInspectorOptions {
  tagId?: string;
}

export interface ProductTagFieldState {
  localId: string;
  current: Product.Mixed.Tag.Field;
  initial?: Product.Tag.Field;
}

const createFieldUid = (field: ProductTagFieldState, inputFieldName: string) => {
  return `${field.localId}/${inputFieldName}`;
}

export const useProductTagInspector = (options: ProductTagInspectorOptions = {}) => {
  const { 
    id = '',
  } = useParams();

  const uuidIsValid = uuid.validate(id);

  const { data: productTag } = useGetProductTagQuery(id, { skip: !uuid.validate(id) })
  const { data: globalProductTags } = useGetProductTagsQuery();

  const [ fields, setFields ] = useState<ProductTagFieldState[]>([]);

  const inputFieldCollectionManagement = useInputFieldCollectionManagement<string>({
    initialDescriptors: [],
    format(payload, input) {
      const descriptor = inputFieldCollectionManagement.findDescriptor(payload);
      if (!descriptor) {
        throw new Error('Internal error');
      }

      const [ fieldId, fieldInputName ] = payload.split('/') as [string, string];
      if (fieldInputName === 'name') {
        if (input === '') {
          throw new Error('Field is required');
        }

        if (fields.some(field => field.current.name === input && fieldId !== field.localId)) {
          throw new Error('Field must have a uniqe name');
        }

        return input;
      }
    },
  });

  const productTagNameInputField = useInputFieldManagement({
    label: 'Tag name',
    required: true,
    inputIcon: faHashtag,
    format(input) {
      return input;
    },
  });
 
  useEffect(() => {
    if (!productTag) {
      return;
    }

    productTagNameInputField.setInputValue(productTag.name, true);
    setFields(productTag.fields.map<ProductTagFieldState>(field => ({
      localId: uuid.v4(),
      initial: { ...field },
      current: { ...field },
    })));
  }, [productTag]);

  useEffect(() => {
    const { fieldDescriptors: existingFieldDescriptors } = inputFieldCollectionManagement;
    const findInputFieldDescriptor = (id: string) => {
      return existingFieldDescriptors.find(descriptor => descriptor.payload === id);
    }

    const descriptors: FieldDescriptor<string>[] = [];
    for (const field of fields) {
      const namePreviousDescriptor = findInputFieldDescriptor(createFieldUid(field, 'name'));
      descriptors.push(namePreviousDescriptor ?? {
        payload: createFieldUid(field, 'name'),
        status: InputStatus.Default,
      });

      const examplePreviousDescriptor = findInputFieldDescriptor(createFieldUid(field, 'example'));
      descriptors.push(examplePreviousDescriptor ?? {
        payload: createFieldUid(field, 'example'),
        status: InputStatus.Default,
      });
    }

    inputFieldCollectionManagement.setDescriptors(descriptors);
  }, [fields]);

  const createField = () => {
    setFields([{
      localId: uuid.v4(),
      current: {
        name: '',
        example: '',
        required: false,
      },
    }, ...fields ]);
  }

  const updateField = (index: number) => (field: ProductTagFieldState, fieldChangeId: string) => {
    const modifiedFields = [...fields];
    modifiedFields[index] = field;
    setFields(modifiedFields);
  }

  const exchangeFieldPosition = (index1: number, index2: number) => {
    const modifiedFields = [...fields];
    [modifiedFields[index1], modifiedFields[index2]] = [modifiedFields[index2], modifiedFields[index1]];
    setFields(modifiedFields);
  }

  const removeField = (index: number) => () => {
    const modifiedFields = [...fields];
    modifiedFields.splice(index, 1);
    setFields(modifiedFields);
  }
  
  const validateInputs = (): Product.Mixed.Tag => {
    const productTagName = productTagNameInputField.getValidatedInputResult();

    let fieldInputsAreInvalid = true;
    for (const field of fields) {
      try {
        inputFieldCollectionManagement.validateValue(createFieldUid(field, 'name'), field.current.name);
      } catch {
        fieldInputsAreInvalid = false;
      }
    }

    if (productTagName === composedValueAbordSymbol || !fieldInputsAreInvalid) {
      throw new Error();
    }

    const productTag: Product.Mixed.Tag = {
      name: productTagName,
      fields: fields.map(field => ({
        ...field.current,
      }))
    }

    return productTag;
  }

  const productTagInitialFields = productTag?.fields.map<ProductTagFieldState>(field => fields.find(f => f.current.id === field.id) ?? ({
    localId: uuid.v4(),
    initial: { ...field },
    current: { ...field },
  }));

  const canRelink = (index: number) => {
    const field = fields[index];

    if (field.current.id) {
      return;
    }

    const fieldWithSameName = productTagInitialFields?.find(initialField => initialField.current.name === field.current.name);
    if (!fieldWithSameName) {
      return;
    }

    if (fields.every(f => f.current.id !== fieldWithSameName.current.id)) {
      return fieldWithSameName;
    }
  }

  const render = () => (
    <Fragment>
      { productTagNameInputField.render() }
      <div className="product-tag-dynamic-fields">
        {fields.map((field, index) => (
          <ProductTagFieldInspector
            key={field.current.id ?? field.initial?.id ?? index}
            index={index}
            fieldState={field}
            canRelinkWith={canRelink(index)}
            exchangeFieldPosition={exchangeFieldPosition}
            updateField={updateField(index)}
            removeField={removeField(index)}
            inputFieldCollectionManagement={inputFieldCollectionManagement}
          />
        ))}
      </div>
    </Fragment>
  )

  return {
    render,
    validateInputs,
    createField,
    updateField,
    removeField,
    exchangeFieldPosition,
  }
}