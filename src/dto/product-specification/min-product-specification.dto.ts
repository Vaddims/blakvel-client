import { MinProductTagFieldDto } from "../product-tag-field/min-product-tag-field.dto";
import { MinProductTagDto } from "../product-tag/min-product-tag.dto";

export interface MinProductSpecificationDto {
  readonly field: MinProductTagFieldDto;
  readonly value: string;
}