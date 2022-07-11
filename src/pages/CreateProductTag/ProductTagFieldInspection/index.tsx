import { ChangeEventHandler, FC, useState } from 'react';
import './product-tag-field-inspection.scss';

export interface ProductTagField {
  name: string;
  required: boolean;
  example: string;
}

export interface ProductTagFieldInspectionState {
  updateField: (field: ProductTagField) => void;
  field: Omit<ProductTagField, 'id'>;
}

export const ProductTagFieldInspection: FC<ProductTagFieldInspectionState> = (props) => {
  const { field, updateField } = props;

  const onFieldNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // setFieldName(event.target.value);
    updateField({ ...field, name: event.target.value });
  }

  const onRequiredStateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // setRequired(event.target.checked);
    updateField({ ...field, required: event.target.checked });
  }

  const onExampleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // setExample(event.target.value);
    updateField({ ...field, example: event.target.value });
  }
  
  return (
    <legend className="product-tag-field-inspection">
      <span>Field Name: </span>
      <input type="text" defaultValue={field.name} onChange={onFieldNameChange} />
      <br />
      <span>Required: </span>
      <input defaultChecked={field.required} type="checkbox" onChange={onRequiredStateChange} />
      <br />
      <span>Example: </span>
      <input type="text" defaultValue={field.example} onChange={onExampleChange} />
    </legend>
  )
}