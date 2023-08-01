import { MinProductTagFieldDto } from "../product-tag-field/min-product-tag-field.dto";

export interface ProductSpecificationDto {
  readonly field: MinProductTagFieldDto;
  readonly value: string;
}