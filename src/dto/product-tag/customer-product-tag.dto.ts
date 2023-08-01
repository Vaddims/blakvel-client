import { CustomerProductTagFieldDto } from "../product-tag-field/customer-product-tag-field.dto";

export interface CustomerProductTagDto {
  readonly id: string;
  readonly name: string;
  readonly fields: CustomerProductTagFieldDto[];
}